
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, SignUpUserData } from '@/types/auth';

export const useAuthMethods = (
  user: User | null,
  parseProfileData: (data: any) => ProfileData,
  setProfile: React.Dispatch<React.SetStateAction<ProfileData | null>>
) => {
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data.user) {
        // Create profile for new user
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          username: userData.username,
          display_name: userData.display_name,
          profile_type: userData.profile_type,
        });
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Update user profile
  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        const updatedProfileData = parseProfileData(data);
        setProfile(updatedProfileData);
        return { data: updatedProfileData, error: null };
      }
      
      return { data: null, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    if (!user) return { url: null, error: new Error('User not authenticated') };
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (error) throw error;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const avatarUrl = data.publicUrl;
      
      // Update profile with avatar URL
      await updateProfile({ avatar: avatarUrl });
      
      return { url: avatarUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) return false;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        const profileData = parseProfileData(data);
        setProfile(profileData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return false;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile
  };
};
