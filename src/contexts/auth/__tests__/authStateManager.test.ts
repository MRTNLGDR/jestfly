
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../authStateManager';
import { supabase } from '../../../integrations/supabase/client';
import { auth, firestore } from '../../../firebase/config';
import { createSupabaseUserData } from '../userDataTransformer';

// Mock dependencies
vi.mock('../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }
}));

vi.mock('../../../firebase/config', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
  },
  firestore: {
    doc: vi.fn(),
    getDoc: vi.fn(),
  }
}));

vi.mock('../userDataTransformer', () => ({
  createSupabaseUserData: vi.fn()
}));

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error;
console.error = vi.fn();

describe('useAuthState hook', () => {
  const mockSession = {
    user: { 
      id: 'test-user-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
    }
  };
  
  const mockProfile = {
    id: 'test-user-id',
    username: 'testuser',
    full_name: 'Test User',
    profile_type: 'fan',
    preferences: { theme: 'dark' }
  };
  
  const mockRoles = [
    { role: 'user' },
    { role: 'member' }
  ];
  
  const mockTransformedUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    username: 'testuser',
    profileType: 'fan',
    roles: ['user', 'member'],
    preferences: { theme: 'dark' },
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    lastLogin: expect.any(Date),
    isVerified: false,
    twoFactorEnabled: false,
    socialLinks: {}
  };

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock Supabase auth methods
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession }
    });
    
    (supabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
    
    // Mock Supabase profile query
    (supabase.from as any).mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: () => ({
              single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
            })
          })
        };
      }
      if (table === 'user_roles') {
        return {
          select: () => ({
            eq: () => vi.fn().mockResolvedValue({ data: mockRoles, error: null })
          })
        };
      }
      return { select: vi.fn() };
    });
    
    // Mock Firebase auth and firestore
    (auth.onAuthStateChanged as any).mockImplementation((callback) => {
      callback(null);
      return vi.fn();
    });
    
    // Mock createSupabaseUserData transformer
    (createSupabaseUserData as any).mockReturnValue(mockTransformedUser);
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should initialize with loading state', async () => {
    const { result } = renderHook(() => useAuthState());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.currentUser).toBe(null);
    expect(result.current.userData).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch user data when session exists', async () => {
    // Setup supabase session return
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession }
    });
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.userData).toEqual(mockTransformedUser);
    });

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(createSupabaseUserData).toHaveBeenCalled();
  });

  it('should handle auth state changes', async () => {
    // Mock auth state change with user login
    let authChangeCallback: any;
    (supabase.auth.onAuthStateChange as any).mockImplementation((callback) => {
      authChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    
    const { result } = renderHook(() => useAuthState());
    
    // Simulate auth state change
    await authChangeCallback('SIGNED_IN', { user: mockSession.user });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Check that profile data was fetched
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });

  it('should clean up subscriptions on unmount', async () => {
    const unsubscribeMock = vi.fn();
    (supabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } }
    });
    
    const firebaseUnsubscribeMock = vi.fn();
    (auth.onAuthStateChanged as any).mockReturnValue(firebaseUnsubscribeMock);
    
    const { unmount } = renderHook(() => useAuthState());
    
    unmount();
    
    expect(unsubscribeMock).toHaveBeenCalled();
    expect(firebaseUnsubscribeMock).toHaveBeenCalled();
  });

  it('should handle errors when fetching user data', async () => {
    // Mock profile fetch error
    (supabase.from as any).mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: () => ({
              single: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to fetch profile') })
            })
          })
        };
      }
      return { select: vi.fn() };
    });
    
    renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching profile:", 
        expect.any(Error)
      );
    });
  });

  it('should fetch Firebase user data as fallback', async () => {
    // Mock Firebase auth with user
    const firebaseUser = { uid: 'firebase-user-id', email: 'firebase@example.com' };
    (auth.onAuthStateChanged as any).mockImplementation((callback) => {
      callback(firebaseUser);
      return vi.fn();
    });
    
    // Mock Firestore document fetch
    const mockFirestoreData = { 
      id: 'firebase-user-id', 
      email: 'firebase@example.com',
      displayName: 'Firebase User' 
    };
    
    const mockDocSnap = { 
      exists: () => true, 
      data: () => mockFirestoreData 
    };
    
    (firestore.doc as any).mockReturnValue('mock-doc-ref');
    (firestore.getDoc as any).mockResolvedValue(mockDocSnap);
    
    // Ensure Supabase returns no session
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null }
    });
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.currentUser).toEqual(firebaseUser);
      expect(result.current.userData).toEqual(mockFirestoreData);
    });
  });
});
