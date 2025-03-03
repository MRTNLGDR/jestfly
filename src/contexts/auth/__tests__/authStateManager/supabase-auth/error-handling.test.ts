
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../../../authStateManager';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../../../../integrations/supabase/client';
import { setupSupabaseMocks, createMockSession } from './mock-helpers';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase config
vi.mock('../../../../../firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  firestore: {},
}));

// Mock Supabase client
vi.mock('../../../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('useAuthState - Supabase Error Handling', () => {
  beforeEach(() => {
    // Setup default mocks
    setupSupabaseMocks();
    
    // Firebase Auth mocks
    vi.mocked(onAuthStateChanged).mockImplementation(() => {
      return vi.fn(); // Return unsubscribe function
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

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
      id: 'user123', 
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
