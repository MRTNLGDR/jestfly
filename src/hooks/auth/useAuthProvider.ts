
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/auth';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse profile data coming from Supabase
  const parseProfileData = (data: any): ProfileData => {
    // Convert JSON object to Record<string, string> for social_links
    const socialLinks = typeof data.social_links === 'string'
      ? JSON.parse(data.social_links)
      : data.social_links || {};

    // Convert preferences JSON to Record<string, any>
    const preferences = typeof data.preferences === 'string'
      ? JSON.parse(data.preferences)
      : data.preferences || {};

    return {
      ...data,
      social_links: socialLinks as Record<string, string>,
      preferences: preferences as Record<string, any>
    };
  };

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        return parseProfileData(data);
      }

      return null;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // Check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        
        // Fetch user profile
        const profileData = await fetchProfile(currentSession.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    };
    
    initAuth();
    
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        const profileData = await fetchProfile(newSession.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    setProfile,
    parseProfileData
  };
};
