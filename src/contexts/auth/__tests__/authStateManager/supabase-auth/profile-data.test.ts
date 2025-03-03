
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

describe('useAuthState - Supabase Profile Data Fetching', () => {
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

  it('should properly fetch and transform profile data from Supabase', async () => {
    // Arrange
    const mockSession = createMockSession();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    
    // Arrange - mock profile data
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
      social_links: {
        instagram: 'test',
        twitter: 'test'
      }
    };
    
    // Arrange - mock roles data
    const mockRolesData = [
      { role: 'user' },
      { role: 'creator' },
    ];
    
    // Setup table mocks
    setupTableMocks(mockProfileData, mockRolesData);
    
    // Act
    const { result } = renderHook(() => useAuthState());
    
    // Assert
    await waitFor(() => {
      expect(result.current.userData).not.toBe(null);
    });
    
    if (result.current.userData) {
      // Verify transformed user data structure
      expect(result.current.userData.id).toBe('user123');
      expect(result.current.userData.email).toBe('test@example.com');
      expect(result.current.userData.displayName).toBe('Test User');
      expect(result.current.userData.profileType).toBe('artist');
      expect(result.current.userData.roles).toContain('user');
      expect(result.current.userData.roles).toContain('creator');
      expect(result.current.userData.isVerified).toBe(true); // Based on email_confirmed_at
      expect(result.current.userData.preferences.theme).toBe('dark');
      expect(result.current.userData.socialLinks.instagram).toBe('test');
    }
  });
  
  it('should handle missing profile data gracefully', async () => {
    // Arrange
    const mockSession = createMockSession();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    
    // Setup table mocks with null data
    setupTableMocks(null, []);
    
    // Act
    const { result } = renderHook(() => useAuthState());
    
    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should not have user data without a profile
    expect(result.current.userData).toBe(null);
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });
});
