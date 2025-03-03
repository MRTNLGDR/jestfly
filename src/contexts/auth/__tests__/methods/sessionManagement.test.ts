
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth } from '../../../../firebase/config';
import { supabase } from '../../../../integrations/supabase/client';
import { logout } from '../../methods/sessionManagement';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../../../../firebase/config', () => ({
  auth: {
    signOut: vi.fn(),
  }
}));

vi.mock('../../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    }
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  }
}));

describe('Session Management Methods', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Setup default success responses
    (supabase.auth.signOut as any).mockResolvedValue({
      error: null
    });

    // Spy on console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
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
});
