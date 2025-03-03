
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyAdminCode } from '../../methods/adminAuth';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  }
}));

// Mock fetch for admin code verification
global.fetch = vi.fn();

describe('Admin Auth Methods', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
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

  describe('verifyAdminCode', () => {
    it('should successfully verify valid admin code', async () => {
      await verifyAdminCode('test-user-id', 'VALID_ADMIN_CODE');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/functions/v1/verify-admin-code',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('anon')
          }),
          body: JSON.stringify({
            userId: 'test-user-id',
            adminCode: 'VALID_ADMIN_CODE'
          })
        })
      );
    });

    it('should handle verification error', async () => {
      (global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Invalid code' })
      });

      await expect(verifyAdminCode('test-user-id', 'INVALID_CODE')).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Código de administrador inválido ou já utilizado');
    });

    it('should handle network error', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(verifyAdminCode('test-user-id', 'ANY_CODE')).rejects.toThrow();
      
      expect(toast.error).toHaveBeenCalledWith('Erro ao verificar código de administrador');
    });
  });
});
