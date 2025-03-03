
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth } from '../../../firebase/config';
import { supabase } from '../../../integrations/supabase/client';
import { login, loginWithGoogle, register, logout, resetPassword } from '../authMethods';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../../../firebase/config', () => ({
  auth: {
    signOut: vi.fn(),
  }
}));

vi.mock('../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      getSession: vi.fn(),
    },
    rpc: vi.fn(),
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  }
}));

// Mock fetch for admin code verification
global.fetch = vi.fn();

describe('Auth Methods', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Setup default success responses
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null
    });
    
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: { provider: 'google' },
      error: null
    });
    
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null
    });
    
    (supabase.auth.resetPasswordForEmail as any).mockResolvedValue({
      error: null
    });
    
    (supabase.auth.signOut as any).mockResolvedValue({
      error: null
    });

    (global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000'
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      await login('test@example.com', 'password123');
      
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
    });

    it('should handle login error', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: {},
        error: { message: 'Invalid login credentials' }
      });

      await expect(login('wrong@example.com', 'wrongpassword')).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas');
    });

    it('should handle email not confirmed error', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: {},
        error: { message: 'Email not confirmed' }
      });

      await expect(login('unconfirmed@example.com', 'password123')).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Email não confirmado. Verifique sua caixa de entrada.');
    });
  });

  describe('loginWithGoogle', () => {
    it('should initiate Google login', async () => {
      await loginWithGoogle();
      
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/profile'
        }
      });
    });

    it('should handle Google login provider not enabled error', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: {},
        error: { message: 'provider is not enabled' }
      });

      await expect(loginWithGoogle()).rejects.toThrow();
      
      expect(console.error).toHaveBeenCalledWith(
        "Google login error:", 
        expect.objectContaining({ message: expect.stringContaining('provider is not enabled') })
      );
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        displayName: 'Test User',
        username: 'testuser',
        profileType: 'fan'
      };

      await register('newuser@example.com', 'password123', userData);
      
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
            username: 'testuser',
            profile_type: 'fan'
          },
          emailRedirectTo: 'http://localhost:3000/login'
        }
      });
      
      expect(toast.success).toHaveBeenCalledWith('Conta criada! Verifique seu email para confirmar o cadastro.');
    });

    it('should verify admin code for admin registration', async () => {
      const userData = {
        displayName: 'Admin User',
        username: 'adminuser',
        profileType: 'admin',
        adminCode: 'SECRET_ADMIN_CODE'
      };

      (supabase.rpc as any).mockResolvedValue({
        data: true,
        error: null
      });

      await register('admin@example.com', 'password123', userData);
      
      expect(supabase.rpc).toHaveBeenCalledWith(
        'has_role',
        { user_id: 'system', required_role: 'admin' }
      );
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/functions/v1/verify-admin-code',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          }),
          body: JSON.stringify({
            userId: 'test-user-id',
            adminCode: 'SECRET_ADMIN_CODE'
          })
        })
      );
    });

    it('should handle registration error for existing user', async () => {
      (supabase.auth.signUp as any).mockResolvedValue({
        data: {},
        error: { message: 'User already registered' }
      });

      await expect(register('existing@example.com', 'password', { displayName: 'Existing', username: 'existing' })).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Este email já está em uso');
    });

    it('should handle invalid admin code error', async () => {
      const userData = {
        displayName: 'Fake Admin',
        username: 'fakeadmin',
        profileType: 'admin',
        adminCode: 'WRONG_CODE'
      };

      (supabase.rpc as any).mockResolvedValue({
        data: false,
        error: null
      });

      await expect(register('fakeadmin@example.com', 'password123', userData)).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Código de administrador inválido ou já utilizado');
    });
  });

  describe('logout', () => {
    it('should sign out user from both Supabase and Firebase', async () => {
      await logout();
      
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(auth.signOut).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logout realizado com sucesso');
    });

    it('should handle logout error', async () => {
      (supabase.auth.signOut as any).mockRejectedValue(new Error('Logout failed'));

      await expect(logout()).rejects.toThrow();
      
      expect(console.error).toHaveBeenCalledWith(
        "Logout error:", 
        expect.objectContaining({ message: 'Logout failed' })
      );
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      await resetPassword('user@example.com');
      
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'user@example.com',
        { redirectTo: 'http://localhost:3000/reset-password' }
      );
      
      expect(toast.success).toHaveBeenCalledWith('Instruções para redefinir senha foram enviadas para o seu email');
    });

    it('should handle password reset error', async () => {
      (supabase.auth.resetPasswordForEmail as any).mockResolvedValue({
        error: { message: 'Email not found' }
      });

      await expect(resetPassword('nonexistent@example.com')).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Email não encontrado');
    });
  });
});
