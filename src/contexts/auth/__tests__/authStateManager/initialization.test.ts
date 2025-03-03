
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../../authStateManager';
import { supabase } from '../../../../integrations/supabase/client';
import { setupBasicSupabaseMocks } from './mockUtils';

// Mock Supabase client
vi.mock('../../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('useAuthState initialization', () => {
  // Setup global mocks
  beforeEach(() => {
    setupBasicSupabaseMocks();
    // Clear all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with loading state and no user', async () => {
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
});
