
import { describe, it, expect } from 'vitest';
import { prepareUserDataForSupabase } from '../../userDataTransformer';
import { User } from '../../../../models/User';

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
