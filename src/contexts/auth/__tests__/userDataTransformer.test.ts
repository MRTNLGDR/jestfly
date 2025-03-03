
import { describe, it, expect } from 'vitest';
import { createSupabaseUserData, prepareUserDataForSupabase, SupabaseAuthUser, SupabaseProfileData } from '../userDataTransformer';
import { User } from '../../../models/User';

describe('userDataTransformer', () => {
  describe('createSupabaseUserData', () => {
    it('should transform Supabase data to User model correctly', () => {
      // Arrange
      const supabaseUser: SupabaseAuthUser = {
        email: 'test@example.com',
        email_confirmed_at: '2023-01-01T00:00:00Z'
      };
      
      const profileData: SupabaseProfileData = {
        id: 'user-123',
        username: 'testuser',
        full_name: 'Test User',
        profile_type: 'fan' as 'fan' | 'artist' | 'admin' | 'collaborator',
        avatar_url: 'https://example.com/avatar.jpg',
        social_links: {
          instagram: 'test_instagram',
          twitter: 'test_twitter'
        },
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        preferences: {
          theme: 'dark' as 'light' | 'dark' | 'system',
          notifications: {
            email: true,
            push: false,
            sms: false
          },
          language: 'en',
          currency: 'USD'
        },
        roles: ['user', 'member']
      };
      
      // Act
      const result = createSupabaseUserData(supabaseUser, profileData);
      
      // Assert
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        username: 'testuser',
        profileType: 'fan',
        avatar: 'https://example.com/avatar.jpg',
        bio: undefined,
        socialLinks: {
          instagram: 'test_instagram',
          twitter: 'test_twitter'
        },
        walletAddress: undefined,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
        lastLogin: expect.any(Date),
        isVerified: true,
        twoFactorEnabled: false,
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            sms: false
          },
          language: 'en',
          currency: 'USD'
        },
        roles: ['user', 'member']
      });
    });
    
    it('should handle missing user data with defaults', () => {
      // Arrange
      const supabaseUser: SupabaseAuthUser = {
        email: 'minimal@example.com',
        email_confirmed_at: null
      };
      
      const minimalProfileData: SupabaseProfileData = {
        id: 'minimal-123'
      };
      
      // Act
      const result = createSupabaseUserData(supabaseUser, minimalProfileData);
      
      // Assert
      expect(result).toEqual({
        id: 'minimal-123',
        email: 'minimal@example.com',
        displayName: 'minimal',
        username: 'minimal',
        profileType: 'fan',
        avatar: undefined,
        bio: undefined,
        socialLinks: {},
        walletAddress: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        lastLogin: expect.any(Date),
        isVerified: false,
        twoFactorEnabled: false,
        preferences: {
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'en',
          currency: 'USD'
        },
        roles: []
      });
    });
  });
  
  describe('prepareUserDataForSupabase', () => {
    it('should transform User data to Supabase format correctly', () => {
      // Arrange
      const userData: Partial<User> = {
        displayName: 'Updated Name',
        username: 'updateduser',
        bio: 'Updated bio',
        avatar: 'https://example.com/new-avatar.jpg',
        profileType: 'artist',
        socialLinks: {
          instagram: 'new_instagram',
          twitter: 'new_twitter',
          website: 'example.com'
        },
        walletAddress: '0x123456789',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            sms: true
          },
          language: 'pt',
          currency: 'BRL'
        }
      };
      
      // Act
      const result = prepareUserDataForSupabase(userData);
      
      // Assert
      expect(result).toEqual({
        full_name: 'Updated Name',
        username: 'updateduser',
        bio: 'Updated bio',
        avatar_url: 'https://example.com/new-avatar.jpg',
        profile_type: 'artist',
        social_links: {
          instagram: 'new_instagram',
          twitter: 'new_twitter',
          website: 'example.com'
        },
        wallet_address: '0x123456789',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            sms: true
          },
          language: 'pt',
          currency: 'BRL'
        }
      });
    });
    
    it('should handle partial updates correctly', () => {
      // Arrange
      const partialUpdate: Partial<User> = {
        displayName: 'Just Name Update',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'en',
          currency: 'USD'
        }
      };
      
      // Act
      const result = prepareUserDataForSupabase(partialUpdate);
      
      // Assert
      expect(result).toEqual({
        full_name: 'Just Name Update',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'en',
          currency: 'USD'
        }
      });
    });
  });
});
