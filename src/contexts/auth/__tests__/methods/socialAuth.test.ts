
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supabase } from '../../../../integrations/supabase/client';
import { loginWithGoogle } from '../../methods/socialAuth';

// Mock dependencies
vi.mock('../../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
    }
  }
}));

describe('Social Auth Methods', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Setup default success responses
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: { provider: 'google' },
      error: null
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000'
      },
      writable: true
    });

    // Spy on console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
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
      
      expect(console.log).toHaveBeenCalledWith(
        "Supabase Google login initiated:", 
        expect.objectContaining({ provider: 'google' })
      );
    });

    it('should handle Google login provider not enabled error', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: {},
        error: { message: 'provider is not enabled' }
      });

      await expect(loginWithGoogle()).rejects.toThrow();
      
      expect(console.error).toHaveBeenCalledWith(
        "Google login error:", 
        expect.objectContaining({ message: expect.stringContaining('Login com Google não está habilitado') })
      );
    });
  });
});
