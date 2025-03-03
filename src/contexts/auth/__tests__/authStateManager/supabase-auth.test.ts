
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { 
        subscription: { 
          unsubscribe: vi.fn(),
          id: 'test-id'
        } 
      },
    } as any);
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as any);
    
    // Clear all mocks
    vi.clearAllMocks();
  });
  
  it('should fetch user data from Supabase when session exists', async () => {
    // Mock Supabase session with all required properties
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user123',
            email: 'test@example.com',
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
          token_type: 'bearer'
        },
      },
      error: null,
    });
    
    // Mock profile data
    const mockProfileData = {
      id: 'user123',
      username: 'testuser',
      full_name: 'Test User',
      profile_type: 'artist' as const,
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
    
    // Mock roles data
    const mockRolesData = [
      { role: 'user' },
      { role: 'creator' },
    ];
    
    // Mock Supabase queries
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
    
    vi.mocked(supabase.from)
      .mockImplementation((table) => {
        if (table === 'profiles') {
          return { select: mockProfileSelect } as any;
        } else if (table === 'user_roles') {
          return { select: mockRolesSelect } as any;
        }
        return { select: vi.fn() } as any;
      });
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.userData).not.toBe(null);
    });
    
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledWith('user_roles');
    
    // Verify user data is correctly structured
    if (result.current.userData) {
      expect(result.current.userData.id).toBe('user123');
      expect(result.current.userData.profileType).toBe('artist');
      expect(result.current.userData.roles).toContain('user');
      expect(result.current.userData.roles).toContain('creator');
    }
  });
  
  it('should handle errors when fetching Supabase profile data', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock Supabase session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user123',
            email: 'test@example.com',
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
          token_type: 'bearer'
        },
      },
      error: null,
    });
    
    // Mock profile query error
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
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching profile:", 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });
});
