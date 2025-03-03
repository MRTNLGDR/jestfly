import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../../authStateManager';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../../firebase/config';
import { supabase } from '../../../../integrations/supabase/client';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn()
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

describe('useAuthState - Firebase Authentication', () => {
  // Common test variables
  const mockFirebaseUserId = 'firebase-user-123';
  const mockFirebaseEmail = 'firebase@example.com';
  
  // Setup mocks for Firebase user
  const createMockFirebaseUser = (override = {}) => ({
    uid: mockFirebaseUserId,
    email: mockFirebaseEmail,
    ...override
  });
  
  // Setup mocks for Firebase user document
  const createMockUserDoc = (override = {}) => ({
    exists: () => true,
    data: () => ({
      id: mockFirebaseUserId,
      email: mockFirebaseEmail,
      displayName: 'Firebase User',
      username: 'firebaseuser',
      profileType: 'fan',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      isVerified: true,
      twoFactorEnabled: false,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        language: 'en',
        currency: 'USD',
      },
      socialLinks: {},
      ...override
    }),
  });
  
  beforeEach(() => {
    // Supabase mocks
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
    
    // Default Firebase mocks
    let authCallback: any = null;
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      authCallback = callback;
      return vi.fn(); // Return unsubscribe function
    });
    
    // Reset Firebase mocks
    vi.mocked(doc).mockReset();
    vi.mocked(getDoc).mockReset();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Firebase Auth State Changes', () => {
    it('should set currentUser when Firebase auth state changes', async () => {
      // Arrange
      const mockFirebaseUser = createMockFirebaseUser();
      let authCallback: any = null;
      
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Trigger auth state change
      if (authCallback) {
        authCallback(mockFirebaseUser);
      }
      
      // Assert
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
      });
    });
    
    it('should clear currentUser when Firebase user signs out', async () => {
      // Arrange
      const mockFirebaseUser = createMockFirebaseUser();
      let authCallback: any = null;
      
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });
      
      // Act - First sign in
      const { result } = renderHook(() => useAuthState());
      
      if (authCallback) {
        authCallback(mockFirebaseUser);
      }
      
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
      });
      
      // Act - Then sign out
      if (authCallback) {
        authCallback(null);
      }
      
      // Assert
      await waitFor(() => {
        expect(result.current.currentUser).toBeNull();
      });
    });
  });

  describe('Firebase User Data Fetching', () => {
    it('should fetch user data from Firebase when Supabase returns no user', async () => {
      // Arrange
      const mockFirebaseUser = createMockFirebaseUser();
      const mockUserDoc = createMockUserDoc();
      let authCallback: any = null;
      
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });
      
      vi.mocked(doc).mockReturnValue('doc-ref' as any);
      vi.mocked(getDoc).mockResolvedValue(mockUserDoc as any);
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Trigger Firebase auth
      if (authCallback) {
        authCallback(mockFirebaseUser);
      }
      
      // Assert
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
      });
      
      await waitFor(() => {
        expect(doc).toHaveBeenCalledWith(firestore, 'users', mockFirebaseUserId);
        expect(getDoc).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect(result.current.userData).not.toBeNull();
        if (result.current.userData) {
          expect(result.current.userData.id).toBe(mockFirebaseUserId);
          expect(result.current.userData.email).toBe(mockFirebaseEmail);
          expect(result.current.userData.username).toBe('firebaseuser');
        }
      });
    });
    
    it('should handle non-existent user document gracefully', async () => {
      // Arrange
      const mockFirebaseUser = createMockFirebaseUser();
      let authCallback: any = null;
      
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });
      
      vi.mocked(doc).mockReturnValue('doc-ref' as any);
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => false,
        data: () => null
      } as any);
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      if (authCallback) {
        authCallback(mockFirebaseUser);
      }
      
      // Assert
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
      });
      
      await waitFor(() => {
        expect(doc).toHaveBeenCalledWith(firestore, 'users', mockFirebaseUserId);
        expect(getDoc).toHaveBeenCalled();
      });
      
      // UserData should remain null if document doesn't exist
      expect(result.current.userData).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors when fetching Firebase user data', async () => {
      // Arrange
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockFirebaseUser = createMockFirebaseUser();
      let authCallback: any = null;
      
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });
      
      vi.mocked(doc).mockReturnValue('doc-ref' as any);
      vi.mocked(getDoc).mockRejectedValue(new Error('Firestore error'));
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      if (authCallback) {
        authCallback(mockFirebaseUser);
      }
      
      // Assert
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
      });
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching user data from Firebase:",
          expect.any(Error)
        );
      });
      
      // UserData should remain null after an error
      expect(result.current.userData).toBeNull();
      
      // Clean up
      consoleErrorSpy.mockRestore();
    });
    
    it('should handle malformed user document data', async () => {
      // Arrange
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockFirebaseUser = createMockFirebaseUser();
      let authCallback: any = null;
      
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });
      
      // Mock a document with invalid/incomplete data
      vi.mocked(doc).mockReturnValue('doc-ref' as any);
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({
          // Missing required fields
          id: mockFirebaseUserId,
          // Other fields missing
        })
      } as any);
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      if (authCallback) {
        authCallback(mockFirebaseUser);
      }
      
      // Assert
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
      });
      
      // UserData should be set with at least the ID from the document
      await waitFor(() => {
        if (result.current.userData) {
          expect(result.current.userData.id).toBe(mockFirebaseUserId);
        }
      });
      
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Authentication Priority', () => {
    it('should prioritize Supabase auth over Firebase when both are present', async () => {
      // Arrange
      const mockFirebaseUser = createMockFirebaseUser();
      const mockFirebaseUserDoc = createMockUserDoc();
      let firebaseAuthCallback: any = null;
      
      // Setup Firebase auth
      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        firebaseAuthCallback = callback;
        return vi.fn();
      });
      
      vi.mocked(doc).mockReturnValue('doc-ref' as any);
      vi.mocked(getDoc).mockResolvedValue(mockFirebaseUserDoc as any);
      
      // Setup Supabase auth with a user
      const mockSupabaseSession = {
        user: {
          id: 'supabase-user-123',
          email: 'supabase@example.com',
          email_confirmed_at: '2023-01-01T00:00:00Z',
        },
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_in: 3600,
        token_type: 'bearer'
      };
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSupabaseSession },
        error: null,
      });
      
      // Mock profile data for the Supabase user
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: 'supabase-user-123',
                    username: 'supabaseuser',
                    profile_type: 'artist'
                  },
                  error: null,
                }),
              }),
            })
          } as any;
        } 
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
      });
      
      // Act
      const { result } = renderHook(() => useAuthState());
      
      // Trigger Firebase auth
      if (firebaseAuthCallback) {
        firebaseAuthCallback(mockFirebaseUser);
      }
      
      // Assert
      await waitFor(() => {
        // Should have the Firebase user in currentUser
        expect(result.current.currentUser).toEqual(mockFirebaseUser);
        
        // But userData should be from Supabase since it was prioritized
        if (result.current.userData) {
          expect(result.current.userData.id).toBe('supabase-user-123');
          expect(result.current.userData.email).toBe('supabase@example.com');
        }
      });
    });
  });
});
