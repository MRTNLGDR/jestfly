
import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../integrations/supabase/client';
import { createSupabaseUserData, SupabaseAuthUser } from './userDataTransformer';

/**
 * Custom hook to manage authentication state
 */
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        return;
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
        // Cast profile_type to the expected union type
        const profileType = profile.profile_type as 'artist' | 'fan' | 'admin' | 'collaborator';
        
        // Parse preferences if it's a string (JSON)
        let preferences = profile.preferences;
        if (typeof preferences === 'string') {
          try {
            preferences = JSON.parse(preferences);
          } catch (e) {
            console.error('Error parsing preferences JSON:', e);
            preferences = {};
          }
        }
        
        // Create combined profile with roles
        const profileWithRoles = {
          ...profile,
          profile_type: profileType,
          // Ensure social_links is properly typed as Record<string, string>
          social_links: profile.social_links ? JSON.parse(JSON.stringify(profile.social_links)) : {},
          preferences: preferences || {},
          roles: roles?.map(r => r.role) || []
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

        setUserData(user);
      }
    } catch (err) {
      console.error("Error fetching user data from Supabase:", err);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth event:', event);
        
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    // Also handle Firebase auth for backward compatibility
    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user && !userData) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          }
        } catch (err) {
          console.error("Error fetching user data from Firebase:", err);
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, [userData]);

  return { currentUser, userData, setUserData, loading, error, setError };
};
