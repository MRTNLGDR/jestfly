
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

describe('useAuthState - Initialization', () => {
  beforeEach(() => {
    // Firebase Auth mocks
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      // We're not calling the callback here as we're just testing initialization
      return vi.fn(); // Return unsubscribe function
    });
    
    // Supabase mocks
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
    
    // Clear all mocks
    vi.clearAllMocks();
  });
  
  it('should initialize with loading state and no user', async () => {
    const { result } = renderHook(() => useAuthState());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.currentUser).toBe(null);
    expect(result.current.userData).toBe(null);
    expect(result.current.error).toBe(null);
    
    // Make sure Supabase session is checked
    expect(supabase.auth.getSession).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });
});
