
import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../integrations/supabase/client';
import { createSupabaseUserData, SupabaseAuthUser } from './userDataTransformer';

/**
 * Custom hook to handle Supabase authentication state
 */
const useSupabaseAuth = (onUserDataChange: (data: User | null) => void) => {
  // Function to fetch user data from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }
      
      // Get email from auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (profile && session?.user) {
        // Prepare roles array
        const userRoles = roles?.map(r => r.role) || [];

        // Parse social_links para garantir que seja um objeto Record<string, string>
        let socialLinks: Record<string, string> = {};
        if (profile.social_links) {
          // Se for uma string JSON, analisa-o
          if (typeof profile.social_links === 'string') {
            try {
              socialLinks = JSON.parse(profile.social_links);
            } catch (e) {
              console.warn('Failed to parse social_links JSON:', e);
            }
          } 
          // Se já for um objeto, usa diretamente
          else if (typeof profile.social_links === 'object') {
            socialLinks = profile.social_links as Record<string, string>;
          }
        }

        // Garantir que as preferências estejam no formato correto
        const preferences = profile.preferences || {};
        
        // Garantir que notifications tenha os campos obrigatórios
        const notifications = {
          email: true,
          push: true,
          sms: false,
          ...(preferences.notifications || {})
        };

        // Create combined profile data with proper type handling
        const profileWithRoles: SupabaseProfileData = {
          ...profile,
          profile_type: profile.profile_type as 'artist' | 'fan' | 'admin' | 'collaborator',
          social_links: socialLinks,
          preferences: {
            ...preferences,
            notifications
          },
          roles: userRoles
        };
        
        // Transform data to User model
        const supabaseAuthUser: SupabaseAuthUser = {
          email: session.user.email || '',
          email_confirmed_at: session.user.email_confirmed_at
        };
        
        const user = createSupabaseUserData(
          supabaseAuthUser,
          profileWithRoles
        );

        return user;
      }
      
      return null;
    } catch (err) {
      console.error("Error fetching user data from Supabase:", err);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id).then(userData => {
          if (userData) {
            onUserDataChange(userData);
          }
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth event:', event);
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            onUserDataChange(userData);
          }
        } else {
          onUserDataChange(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [onUserDataChange]);
};

/**
 * Custom hook to handle Firebase authentication state
 */
const useFirebaseAuth = (userData: User | null, onUserChange: (user: FirebaseUser | null) => void, onUserDataChange: (data: User | null) => void) => {
  useEffect(() => {
    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      onUserChange(user);
      
      if (user && !userData) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            onUserDataChange(userDoc.data() as User);
          }
        } catch (err) {
          console.error("Error fetching user data from Firebase:", err);
        }
      }
    });

    return () => {
      unsubscribeFirebase();
    };
  }, [userData, onUserChange, onUserDataChange]);
};

/**
 * Main hook to manage authentication state from multiple providers
 */
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use Supabase authentication
  useSupabaseAuth(setUserData);
  
  // Use Firebase authentication as fallback
  useFirebaseAuth(userData, setCurrentUser, setUserData);

  // Set loading to false when auth state is initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return { currentUser, userData, setUserData, loading, error, setError };
};
