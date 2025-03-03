
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../../state/useAuthState';
import { supabase } from '../../../../integrations/supabase/client';
import { 
  createMockSupabaseUser, 
  createMockSession, 
  createMockSubscription,
  mockSupabaseFromForProfile,
  mockSupabaseFromForRoles
} from './mockUtils';

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

describe('useAuthState fetchUserData', () => {
  beforeEach(() => {
    // Default setup - clear mocks
    vi.clearAllMocks();
    
    // Default onAuthStateChange mock
    const mockSubscription = createMockSubscription();
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { 
        subscription: mockSubscription 
      },
    });
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should fetch user data from Supabase when session exists', async () => {
    // Mock Supabase user
    const mockSupabaseUser = createMockSupabaseUser();
    
    // Mock session Supabase
    const mockSession = createMockSession(mockSupabaseUser);
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: mockSession,
      },
      error: null,
    });
    
    // Mock profile data
    const mockProfileData = {
      id: 'user123',
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
    };
    
    // Mock roles data
    const mockRolesData = [
      { role: 'user' },
      { role: 'creator' },
    ];
    
    // Setup mock for profile data
    const mockFromSelect = mockSupabaseFromForProfile(mockProfileData);
    
    // Setup mock for roles data
    const mockFromSelectRoles = mockSupabaseFromForRoles(mockRolesData);
    
    vi.mocked(supabase.from)
      .mockImplementation((table) => {
        if (table === 'profiles') {
          return { select: mockFromSelect } as any;
        } else if (table === 'user_roles') {
          return { select: mockFromSelectRoles } as any;
        }
        return { select: vi.fn() } as any;
      });
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).not.toBe(null);
      expect(result.current.userData).not.toBe(null);
    });
    
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledWith('user_roles');
  });
  
  it('should handle errors when fetching profile from Supabase', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock Supabase user
    const mockSupabaseUser = createMockSupabaseUser();
    
    // Mock session Supabase
    const mockSession = createMockSession(mockSupabaseUser);
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: mockSession,
      },
      error: null,
    });
    
    // Mock error for profile query
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
        "Erro ao buscar perfil:", 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });
});
