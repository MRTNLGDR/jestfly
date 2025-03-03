
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

describe('useAuthState - Supabase Authentication Initialization', () => {
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
      
      // Mock profile and roles data
      const mockProfileData = {
        id: 'user123',
        username: 'testuser',
        profile_type: 'fan',
      };
      
      // Setup table mocks
      setupTableMocks(
        mockProfileData,
        [{ role: 'user' }]
      );
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.userData).not.toBe(null);
      });
      
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from).toHaveBeenCalledWith('user_roles');
      expect(result.current.userData?.id).toBe('user123');
    });
  });
});
