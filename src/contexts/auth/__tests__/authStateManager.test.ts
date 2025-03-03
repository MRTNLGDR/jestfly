
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../authStateManager';
import { supabase } from '../../../integrations/supabase/client';

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

// Tipo para um usuário Supabase mockado
type MockSupabaseUser = {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
};

// Tipo para uma sessão Supabase mockada
type MockSupabaseSession = {
  user: MockSupabaseUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

describe('useAuthState', () => {
  // Setup global e mocks
  beforeEach(() => {
    // Mock para Supabase getSession
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    // Mock para Supabase onAuthStateChange
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { 
        subscription: { 
          unsubscribe: vi.fn(),
        } 
      },
    });
    
    // Mock para Supabase from (para consultas)
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as any);
    
    // Limpar todos os mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('deve inicializar com estado de carregamento e sem usuário', async () => {
    const { result } = renderHook(() => useAuthState());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.session).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.userData).toBe(null);
    expect(result.current.error).toBe(null);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
  
  it('deve buscar dados do usuário do Supabase quando a sessão existe', async () => {
    // Mock usuário Supabase
    const mockSupabaseUser: MockSupabaseUser = {
      id: 'user123',
      email: 'test@example.com',
      email_confirmed_at: '2023-01-01T00:00:00Z',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z',
    };
    
    // Mock sessão Supabase
    const mockSession: MockSupabaseSession = {
      user: mockSupabaseUser,
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'bearer'
    };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: mockSession,
      },
      error: null,
    });
    
    // Mock dados do perfil
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
    };
    
    // Mock dados de roles
    const mockRolesData = [
      { role: 'user' },
      { role: 'creator' },
    ];
    
    // Mock consultas Supabase
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
      expect(result.current.user).not.toBe(null);
      expect(result.current.userData).not.toBe(null);
    });
    
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledWith('user_roles');
  });
  
  it('deve lidar com erros ao buscar dados do perfil do Supabase', async () => {
    // Espiar console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock usuário Supabase
    const mockSupabaseUser: MockSupabaseUser = {
      id: 'user123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z',
    };
    
    // Mock sessão Supabase
    const mockSession: MockSupabaseSession = {
      user: mockSupabaseUser,
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'bearer'
    };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: mockSession,
      },
      error: null,
    });
    
    // Mock erro de consulta de perfil
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Erro de banco de dados'),
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
        "Erro ao buscar perfil:", 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });
  
  it('deve lidar com mudanças de estado de autenticação', async () => {
    // Primeiro carregamento sem usuário
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    const authChangeCallback = vi.fn();
    
    // Mock para onAuthStateChange
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      authChangeCallback.mockImplementation(callback);
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });
    
    const { result } = renderHook(() => useAuthState());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBe(null);
    });
    
    // Simular login
    const mockSupabaseUser: MockSupabaseUser = {
      id: 'user123',
      email: 'test@example.com',
      email_confirmed_at: '2023-01-01T00:00:00Z',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z',
    };
    
    // Mock sessão Supabase
    const mockSession: MockSupabaseSession = {
      user: mockSupabaseUser,
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'bearer'
    };
    
    // Chamar o callback de mudança de autenticação manualmente
    if (authChangeCallback.mock.calls.length > 0) {
      authChangeCallback('SIGNED_IN', mockSession);
      
      // Mock getSession para o fetchUserData
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      // Mock para busca de perfil após login
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: { id: 'user123', profile_type: 'fan' },
          error: null 
        }),
      } as any);
    }
  });
});
