
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  beforeEach(() => {
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
  
  it('should fetch user data from Firebase if Supabase returns no user', async () => {
    // Setup Firebase auth mock that manually triggers the callback
    const mockFirebaseUser = {
      uid: 'firebase-user-123',
      email: 'firebase@example.com',
    };
    
    // We need to use mockImplementation to handle the callback properly
    let authCallback: any;
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      authCallback = callback;
      return vi.fn(); // Return unsubscribe function
    });
    
    // Mock Firestore doc
    const mockUserDoc = {
      exists: () => true,
      data: () => ({
        id: 'firebase-user-123',
        email: 'firebase@example.com',
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
      }),
    };
    
    // Setup mocks for doc and getDoc
    vi.mocked(doc).mockReturnValue('doc-ref' as any);
    vi.mocked(getDoc).mockResolvedValue(mockUserDoc as any);
    
    const { result } = renderHook(() => useAuthState());
    
    // Now trigger the Firebase auth callback
    if (authCallback) {
      authCallback(mockFirebaseUser);
    }
    
    await waitFor(() => {
      expect(result.current.currentUser).toEqual(mockFirebaseUser);
    });
    
    // Verify Firebase user data is loaded
    await waitFor(() => {
      expect(getDoc).toHaveBeenCalled();
    });
  });
  
  it('should handle errors when fetching Firebase user data', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup Firebase auth mock
    const mockFirebaseUser = {
      uid: 'firebase-user-error',
      email: 'firebase-error@example.com',
    };
    
    // We need to use mockImplementation to handle the callback properly
    let authCallback: any;
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      authCallback = callback;
      return vi.fn();
    });
    
    // Setup mocks for doc and getDoc
    vi.mocked(doc).mockReturnValue('doc-ref' as any);
    vi.mocked(getDoc).mockRejectedValue(new Error('Firestore error'));
    
    const { result } = renderHook(() => useAuthState());
    
    // Now trigger the Firebase auth callback
    if (authCallback) {
      authCallback(mockFirebaseUser);
    }
    
    await waitFor(() => {
      expect(result.current.currentUser).toEqual(mockFirebaseUser);
    });
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching user data from Firebase:",
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });
});
