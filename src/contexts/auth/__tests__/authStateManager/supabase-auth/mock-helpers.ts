
import { vi } from 'vitest';
import { supabase } from '../../../../../integrations/supabase/client';

// Tipos comum para os mocks
export interface MockSession {
  user: {
    id: string;
    email: string;
    email_confirmed_at: string | null;
    app_metadata: Record<string, any>;
    user_metadata: Record<string, any>;
    aud: string;
    created_at: string;
    role: string;
  };
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Helper para criar uma sessão mock
export const createMockSession = (
  override: Partial<MockSession> = {}
): MockSession => ({
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
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  ...override
});

// Configuração dos mocks do Supabase
export const setupSupabaseMocks = () => {
  // Reset mocks
  vi.resetAllMocks();
  
  // Mock getSession
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: null },
    error: null,
  });
  
  // Mock onAuthStateChange
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(() => {
    return {
      data: { 
        subscription: { 
          unsubscribe: vi.fn(),
          id: 'test-id'
        } 
      },
    } as any;
  });
  
  // Mock from
  vi.mocked(supabase.from).mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any);
};

// Helper para configurar mock de perfil
export const setupProfileMock = (profileData: any) => {
  const mockProfileSelect = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: profileData,
        error: null,
      }),
    }),
  });
  
  return mockProfileSelect;
};

// Helper para configurar mock de roles
export const setupRolesMock = (rolesData: any) => {
  const mockRolesSelect = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: rolesData,
        error: null,
      }),
    }),
  });
  
  return mockRolesSelect;
};

// Helper para configurar mocks específicos de tabela
export const setupTableMocks = (profileData: any, rolesData: any) => {
  vi.mocked(supabase.from).mockImplementation((table) => {
    if (table === 'profiles') {
      return { select: setupProfileMock(profileData) } as any;
    } else if (table === 'user_roles') {
      return { select: setupRolesMock(rolesData) } as any;
    }
    return { select: vi.fn() } as any;
  });
};
