
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../../authStateManager';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../../../integrations/supabase/client';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase config
vi.mock('../../../../firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  firestore: {},
}));

// Mock Supabase client
vi.mock('../../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('useAuthState - Supabase Authentication', () => {
  // Common test variables
  const mockUserId = 'user123';
  const mockEmail = 'test@example.com';
  
  // Setup mocks for session
  const createMockSession = (override = {}) => ({
    user: {
      id: mockUserId,
      email: mockEmail,
      email_confirmed_at: '2023-01-01T00:00:00Z',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01',
      role: ''
    },
    // Required Session properties
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    ...override
  });
  
  beforeEach(() => {
    // Firebase Auth mocks
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      return vi.fn(); // Return unsubscribe function
    });
    
    // Default Supabase mock return values
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      return {
        data: { 
          subscription: { 
            unsubscribe: vi.fn(),
            id: 'test-id'
          } 
        },
      } as any;
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as any);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Session initialization', () => {
    it('should initialize with no user when no session exists', async () => {
      // Arrange - explicitly set no session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.userData).toBe(null);
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });
    
    it('should detect an existing session during initialization', async () => {
      // Arrange
      const mockSession = createMockSession();
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Mock from calls for profile and roles
      const mockProfileData = {
        id: mockUserId,
        username: 'testuser',
        profile_type: 'fan',
      };
      
      const mockProfileSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfileData,
            error: null,
          }),
        }),
      });
      
      const mockRolesSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: [{ role: 'user' }],
            error: null,
          }),
        }),
      });
      
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return { select: mockProfileSelect } as any;
        } else if (table === 'user_roles') {
          return { select: mockRolesSelect } as any;
        }
        return { select: vi.fn() } as any;
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.userData).not.toBe(null);
      });
      
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from).toHaveBeenCalledWith('user_roles');
      expect(result.current.userData?.id).toBe(mockUserId);
    });
  });
  
  describe('Profile data fetching', () => {
    it('should properly fetch and transform profile data from Supabase', async () => {
      // Arrange
      const mockSession = createMockSession();
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Arrange - mock profile data
      const mockProfileData = {
        id: mockUserId,
        username: 'testuser',
        full_name: 'Test User',
        profile_type: 'artist',
        avatar_url: 'https://example.com/avatar.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          language: 'en',
          currency: 'USD',
        },
        social_links: {
          instagram: 'test',
          twitter: 'test'
        }
      };
      
      // Arrange - mock roles data
      const mockRolesData = [
        { role: 'user' },
        { role: 'creator' },
      ];
      
      // Arrange - setup mock implementations
      const mockProfileSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfileData,
            error: null,
          }),
        }),
      });
      
      const mockRolesSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: mockRolesData,
            error: null,
          }),
        }),
      });
      
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return { select: mockProfileSelect } as any;
        } else if (table === 'user_roles') {
          return { select: mockRolesSelect } as any;
        }
        return { select: vi.fn() } as any;
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.userData).not.toBe(null);
      });
      
      if (result.current.userData) {
        // Verify transformed user data structure
        expect(result.current.userData.id).toBe(mockUserId);
        expect(result.current.userData.email).toBe(mockEmail);
        expect(result.current.userData.displayName).toBe('Test User');
        expect(result.current.userData.profileType).toBe('artist');
        expect(result.current.userData.roles).toContain('user');
        expect(result.current.userData.roles).toContain('creator');
        expect(result.current.userData.isVerified).toBe(true); // Based on email_confirmed_at
        expect(result.current.userData.preferences.theme).toBe('dark');
        expect(result.current.userData.socialLinks.instagram).toBe('test');
      }
    });
    
    it('should handle missing profile data gracefully', async () => {
      // Arrange
      const mockSession = createMockSession();
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Arrange - setup mock implementations with null profile data
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return { 
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null, // No profile data
                  error: null,
                }),
              }),
            })
          } as any;
        } else if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: [], // No roles
                  error: null,
                }),
              }),
            })
          } as any;
        }
        return { select: vi.fn() } as any;
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      // Should not have user data without a profile
      expect(result.current.userData).toBe(null);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });
  
  describe('Error handling', () => {
    it('should handle errors when fetching profile data', async () => {
      // Arrange - spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Arrange - mock session
      const mockSession = createMockSession();
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Arrange - mock profile query error
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('Database error'),
            }),
          }),
        }),
      } as any);
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching profile:", 
        expect.any(Error)
      );
      
      // Clean up
      consoleErrorSpy.mockRestore();
    });
    
    it('should handle errors when fetching roles data', async () => {
      // Arrange - spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Arrange - mock session
      const mockSession = createMockSession();
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Arrange - mock successful profile but error on roles
      const mockProfileData = { 
        id: mockUserId, 
        profile_type: 'fan' 
      };
      
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockProfileData,
                  error: null,
                }),
              }),
            })
          } as any;
        } else if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: null,
                  error: new Error('Roles fetch error'),
                }),
              }),
            })
          } as any;
        }
        return { select: vi.fn() } as any;
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching roles:", 
        expect.any(Error)
      );
      
      // User data should still be created, but with no roles
      expect(result.current.userData).not.toBe(null);
      if (result.current.userData) {
        expect(result.current.userData.roles).toEqual([]);
      }
      
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('Auth state changes', () => {
    it('should update user data when Supabase auth state changes', async () => {
      // Arrange - initial empty state
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });
      
      // Arrange - mock auth state change callback
      let authChangeCallback: any;
      vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
        authChangeCallback = callback;
        return {
          data: { 
            subscription: { 
              unsubscribe: vi.fn(),
              id: 'test-id'
            } 
          }
        } as any;
      });
      
      // Act - render hook
      const { result } = renderHook(() => useAuthState());
      
      // Assert - initially no user
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.userData).toBe(null);
      
      // Arrange - mock profile data for auth change
      const mockProfileData = { 
        id: mockUserId, 
        profile_type: 'fan',
        username: 'statechangeuser'
      };
      
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockProfileData,
                  error: null,
                }),
              }),
            })
          } as any;
        } else if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: [{ role: 'user' }],
                  error: null,
                }),
              }),
            })
          } as any;
        }
        return { select: vi.fn() } as any;
      });
      
      // Act - trigger auth state change
      if (authChangeCallback) {
        const mockSession = createMockSession();
        authChangeCallback('SIGNED_IN', { 
          session: mockSession
        });
      }
      
      // Assert - should fetch and update user data
      await waitFor(() => {
        expect(result.current.userData).not.toBe(null);
      });
      
      if (result.current.userData) {
        expect(result.current.userData.id).toBe(mockUserId);
        expect(result.current.userData.username).toBe('statechangeuser');
      }
    });
    
    it('should clear user data when user signs out', async () => {
      // Arrange - mock initial logged in state
      const mockSession = createMockSession();
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Arrange - mock profile data
      const mockProfileData = { 
        id: mockUserId, 
        profile_type: 'fan' 
      };
      
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockProfileData,
                  error: null,
                }),
              }),
            })
          } as any;
        } else {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            })
          } as any;
        }
      });
      
      // Arrange - mock auth state change callback
      let authChangeCallback: any;
      vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
        authChangeCallback = callback;
        return {
          data: { 
            subscription: { 
              unsubscribe: vi.fn(),
              id: 'test-id'
            } 
          }
        } as any;
      });
      
      // Act - render hook with initial logged in state
      const { result } = renderHook(() => useAuthState());
      
      // Assert - initially has user
      await waitFor(() => {
        expect(result.current.userData).not.toBe(null);
      });
      
      // Act - trigger sign out
      if (authChangeCallback) {
        authChangeCallback('SIGNED_OUT', { session: null });
      }
      
      // Assert - user data should be cleared
      await waitFor(() => {
        expect(result.current.userData).toBe(null);
      });
    });
  });
});

