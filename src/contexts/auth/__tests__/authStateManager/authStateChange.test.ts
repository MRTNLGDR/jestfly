
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthState } from '../../state/useAuthState';
import { supabase } from '../../../../integrations/supabase/client';
import { 
  createMockSupabaseUser, 
  createMockSession, 
  mockSupabaseFromForProfile
} from './mockUtils';
import { AuthChangeEvent } from '@supabase/supabase-js';

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

describe('useAuthState auth state changes', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should handle authentication state changes', async () => {
    // First load without user
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    const authChangeCallback = vi.fn();
    
    // Mock for onAuthStateChange
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      authChangeCallback.mockImplementation(callback as any);
      return {
        data: {
          subscription: {
            id: 'mock-subscription-id',
            callback: vi.fn(),
            unsubscribe: vi.fn()
          },
        },
      };
    });
    
    renderHook(() => useAuthState());
    
    // Simulate login
    const mockSupabaseUser = createMockSupabaseUser();
    
    // Mock session Supabase
    const mockSession = createMockSession(mockSupabaseUser);
    
    // Call the auth change callback manually if it was registered
    if (authChangeCallback.mock.calls.length > 0) {
      authChangeCallback('SIGNED_IN' as AuthChangeEvent, mockSession);
      
      // Mock getSession for fetchUserData
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Mock for profile fetch after login
      const mockFromSelect = mockSupabaseFromForProfile({ 
        id: 'user123', 
        profile_type: 'fan' 
      });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockFromSelect,
      } as any);
    }
  });
});
