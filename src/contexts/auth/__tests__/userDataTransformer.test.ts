
import { describe, it, expect } from 'vitest';
import { createSupabaseUserData, prepareUserDataForSupabase } from '../userDataTransformer';
import { User } from '../../../models/User';

describe('userDataTransformer', () => {
  describe('createSupabaseUserData', () => {
    it('should transform Supabase user data to app User model', () => {
      // Test minimal data
      const supabaseUser = {
        email: 'test@example.com',
        email_confirmed_at: '2023-01-01T12:00:00Z'
      };
      
      const profileData = {
        id: 'user-123',
        username: 'testuser',
        full_name: 'Test User',
        profile_type: 'fan',
        avatar_url: 'https://example.com/avatar.jpg',
        social_links: {
          instagram: 'test_instagram',
          twitter: 'test_twitter'
        },
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false
          }
        },
        roles: ['user', 'member']
      };
      
      const result = createSupabaseUserData(supabaseUser, profileData);
      
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        username: 'testuser',
        profileType: 'fan',
        avatar: 'https://example.com/avatar.jpg',
        socialLinks: {
          instagram: 'test_instagram',
          twitter: 'test_twitter'
        },
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
    
    it('should provide default values for missing properties', () => {
      // Test with minimal data
      const supabaseUser = {
        email: 'minimal@example.com',
      };
      
      const profileData = {
        id: 'user-456'
      };
      
      const result = createSupabaseUserData(supabaseUser, profileData);
      
      expect(result).toEqual({
        id: 'user-456',
        email: 'minimal@example.com',
        displayName: 'minimal',
        username: 'minimal',
        profileType: 'fan',
        avatar: undefined,
        socialLinks: {},
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
    it('should transform User model to Supabase format', () => {
      const appUser: Partial<User> = {
        displayName: 'Updated User',
        username: 'updateduser',
        avatar: 'https://example.com/new-avatar.jpg',
        bio: 'This is my bio',
        profileType: 'artist',
        socialLinks: {
          instagram: 'new_instagram',
          twitter: 'new_twitter',
          spotify: 'spotify_profile'
        },
        preferences: {
          theme: 'light',
          notifications: {
            email: false,
            push: true,
            sms: true
          },
          language: 'pt',
          currency: 'BRL'
        }
      };
      
      const result = prepareUserDataForSupabase(appUser);
      
      expect(result).toEqual({
        full_name: 'Updated User',
        username: 'updateduser',
        avatar_url: 'https://example.com/new-avatar.jpg',
        bio: 'This is my bio',
        profile_type: 'artist',
        social_links: {
          instagram: 'new_instagram',
          twitter: 'new_twitter',
          spotify: 'spotify_profile'
        },
        preferences: {
          theme: 'light',
          notifications: {
            email: false,
            push: true,
            sms: true
          },
          language: 'pt',
          currency: 'BRL'
        }
      });
    });
    
    it('should handle partial updates correctly', () => {
      // Test with only a few fields to update
      const partialUser: Partial<User> = {
        displayName: 'Just Name',
        preferences: {
          theme: 'dark'
        }
      };
      
      const result = prepareUserDataForSupabase(partialUser);
      
      expect(result).toEqual({
        full_name: 'Just Name',
        preferences: {
          theme: 'dark'
        }
      });
    });
    
    it('should exclude non-profile fields', () => {
      const userWithExtraFields: Partial<User> = {
        id: 'should-not-be-included',
        email: 'should-not-be-included@example.com',
        displayName: 'Include Me',
        createdAt: new Date(),
        isVerified: true
      };
      
      const result = prepareUserDataForSupabase(userWithExtraFields);
      
      expect(result).toEqual({
        full_name: 'Include Me'
      });
      
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('email');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('isVerified');
    });
  });
});
