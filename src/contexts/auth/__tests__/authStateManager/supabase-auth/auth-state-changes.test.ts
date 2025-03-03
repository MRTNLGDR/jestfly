
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../../../authStateManager';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../../../../integrations/supabase/client';
import { setupSupabaseMocks, createMockSession, setupTableMocks } from './mock-helpers';

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

describe('useAuthState - Supabase Auth State Changes', () => {
  // Armazenar o callback para simular mudanças de estado
  let authChangeCallback: any;
  
  beforeEach(() => {
    // Setup default mocks
    setupSupabaseMocks();
    
    // Firebase Auth mocks
    vi.mocked(onAuthStateChanged).mockImplementation(() => {
      return vi.fn(); // Return unsubscribe function
    });
    
    // Configurar callbacks para mudanças de estado
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
  });
  
  afterEach(() => {
    vi.clearAllMocks();
    authChangeCallback = null;
  });

  it('should update user data when Supabase auth state changes', async () => {
    // Arrange - initial empty state
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
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
      id: 'user123', 
      profile_type: 'fan',
      username: 'statechangeuser'
    };
    
    // Setup table mocks for auth change
    setupTableMocks(mockProfileData, [{ role: 'user' }]);
    
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
      expect(result.current.userData.id).toBe('user123');
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
      id: 'user123', 
      profile_type: 'fan' 
    };
    
    // Setup table mocks
    setupTableMocks(mockProfileData, []);
    
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
