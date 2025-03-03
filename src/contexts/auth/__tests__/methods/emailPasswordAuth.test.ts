
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supabase } from '../../../../integrations/supabase/client';
import { login, register, resetPassword } from '../../methods/emailPasswordAuth';
import { verifyAdminCode } from '../../methods/adminAuth';
import { toast } from 'sonner';
import { User } from '../../../../models/User';

// Mock dependencies
vi.mock('../../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    rpc: vi.fn(),
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

vi.mock('../../methods/adminAuth', () => ({
  verifyAdminCode: vi.fn()
}));

// Mock fetch for admin code verification
global.fetch = vi.fn();

describe('Email Password Auth Methods', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Setup default success responses
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null
    });
    
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null
    });
    
    (supabase.auth.resetPasswordForEmail as any).mockResolvedValue({
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

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData: Partial<User> = {
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
      const userData: Partial<User> = {
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
      
      expect(verifyAdminCode).toHaveBeenCalledWith('test-user-id', 'SECRET_ADMIN_CODE');
    });

    it('should handle registration error for existing user', async () => {
      (supabase.auth.signUp as any).mockResolvedValue({
        data: {},
        error: { message: 'User already registered' }
      });

      await expect(register('existing@example.com', 'password', { 
        displayName: 'Existing', 
        username: 'existing',
        profileType: 'fan'
      })).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Este email já está em uso');
    });

    it('should handle invalid admin code error', async () => {
      const userData: Partial<User> = {
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
