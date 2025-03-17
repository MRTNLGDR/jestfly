
import { ProfileType } from '../../../integrations/supabase/schema';

export const useAuthState = () => {
  // Mock user data
  const mockUser = {
    id: 'mock-user-id',
    email: 'user@example.com',
  };

  // Mock user profile data
  const mockUserData = {
    id: 'mock-user-id',
    email: 'user@example.com',
    username: 'user',
    display_name: 'Demo User',
    bio: 'This is a demo user account',
    avatar_url: '',
    followers_count: 0,
    following_count: 0,
    created_at: new Date().toISOString(),
    profile_type: 'admin' as ProfileType,
    is_verified: true,
  };

  // Mock functions and state
  const checkPermission = () => true;
  
  return {
    currentUser: mockUser,
    userData: mockUserData,
    loading: false,
    error: null,
    setError: () => {},
    setUserData: () => {},
    isAdmin: true,
    isArtist: true,
    hasPermission: checkPermission,
    refreshUserData: async () => {}
  };
};
