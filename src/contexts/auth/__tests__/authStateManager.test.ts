
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../authStateManager';
import { auth, firestore } from '../../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../../integrations/supabase/client';
import { User } from '../../../models/User';
import { doc, getDoc } from 'firebase/firestore';

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
vi.mock('../../../firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  firestore: {},
}));

// Mock Supabase client
vi.mock('../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('useAuthState', () => {
  // Global mocks and setup
  beforeEach(() => {
    // Firebase Auth mocks
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      // Immediately invoke callback with null user
      callback(null);
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
          id: 'test-id',
          callback: vi.fn()
        } 
      },
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as any);
    
    // Clear all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with loading state and no user', async () => {
    const { result } = renderHook(() => useAuthState());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.currentUser).toBe(null);
    expect(result.current.userData).toBe(null);
    expect(result.current.error).toBe(null);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
  
  it('should fetch user data from Supabase when session exists', async () => {
    // Mock Supabase session
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
        },
      },
      error: null,
    });
    
    // Mock profile data
    const mockProfileData = {
      id: 'user123',
      username: 'testuser',
      full_name: 'Test User',
      profile_type: 'artist' as 'artist' | 'fan' | 'admin' | 'collaborator',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      preferences: {
        theme: 'dark' as 'dark' | 'light' | 'system',
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
    
    // Mock Supabase queries
    const mockFromSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockProfileData,
          error: null,
        }),
      }),
    });
    
    const mockFromSelectRoles = vi.fn().mockReturnValue({
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
          return { select: mockFromSelect } as any;
        } else if (table === 'user_roles') {
          return { select: mockFromSelectRoles } as any;
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
  
  it('should fetch user data from Firebase if Supabase returns no user', async () => {
    // Mock Firebase auth state
    const mockFirebaseUser = {
      uid: 'firebase-user-123',
      email: 'firebase@example.com',
    };
    
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockFirebaseUser as any);
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
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.currentUser).toBe(mockFirebaseUser);
    });
  });
  
  it('should handle errors when fetching Firebase user data', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock Firebase auth state
    const mockFirebaseUser = {
      uid: 'firebase-user-error',
      email: 'firebase-error@example.com',
    };
    
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockFirebaseUser as any);
      return vi.fn(); // Return unsubscribe function
    });
    
    // Setup mocks for doc and getDoc
    vi.mocked(doc).mockReturnValue('doc-ref' as any);
    vi.mocked(getDoc).mockRejectedValue(new Error('Firestore error'));
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
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
