
import { vi } from 'vitest';
import { AuthChangeEvent, Session, Subscription, User } from '@supabase/supabase-js';
import { supabase } from '../../../../integrations/supabase/client';

// Interface for a mock Supabase user that matches the required User type
export interface MockSupabaseUser extends User {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
}

// Interface for a mock Supabase session
export interface MockSupabaseSession extends Session {
  user: MockSupabaseUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Setup mock Subscription
export const createMockSubscription = (): Subscription => ({
  id: 'mock-subscription-id',
  callback: vi.fn(),
  unsubscribe: vi.fn()
});

// Create mock Supabase user
export const createMockSupabaseUser = (overrides = {}): MockSupabaseUser => ({
  id: 'user123',
  email: 'test@example.com',
  email_confirmed_at: '2023-01-01T00:00:00Z',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00Z',
  ...overrides
});

// Create mock Supabase session
export const createMockSession = (user = createMockSupabaseUser()): MockSupabaseSession => ({
  user,
  access_token: 'fake-token',
  refresh_token: 'fake-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  provider_token: null,
  provider_refresh_token: null
});

// Setup basic Supabase mocks
export const setupBasicSupabaseMocks = () => {
  // Mock for Supabase getSession
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: null },
    error: null,
  });
  
  // Mock for Supabase onAuthStateChange
  const mockSubscription = createMockSubscription();
  
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { 
      subscription: mockSubscription 
    },
  });
  
  // Mock for Supabase from (for queries)
  vi.mocked(supabase.from).mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any);
};

// Mock Supabase's from method for user profile queries
export const mockSupabaseFromForProfile = (profileData: any = null, error: any = null) => {
  const mockFromSelect = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: profileData,
        error,
      }),
    }),
  });
  
  return mockFromSelect;
};

// Mock Supabase's from method for roles queries
export const mockSupabaseFromForRoles = (rolesData: any[] = [], error: any = null) => {
  const mockFromSelectRoles = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: rolesData,
        error,
      }),
    }),
  });
  
  return mockFromSelectRoles;
};
