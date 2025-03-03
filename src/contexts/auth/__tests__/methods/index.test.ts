
import { describe, it, expect, vi } from 'vitest';
import * as authMethods from '../../methods';
import * as emailPasswordAuth from '../../methods/emailPasswordAuth';
import * as socialAuth from '../../methods/socialAuth';
import * as sessionManagement from '../../methods/sessionManagement';
import * as adminAuth from '../../methods/adminAuth';
import * as profileManagement from '../../methods/profileManagement';

// Mock all the auth method modules
vi.mock('../../methods/emailPasswordAuth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  resetPassword: vi.fn()
}));

vi.mock('../../methods/socialAuth', () => ({
  loginWithGoogle: vi.fn()
}));

vi.mock('../../methods/sessionManagement', () => ({
  logout: vi.fn()
}));

vi.mock('../../methods/adminAuth', () => ({
  verifyAdminCode: vi.fn()
}));

vi.mock('../../methods/profileManagement', () => ({
  updateUserProfile: vi.fn(),
  fetchUserProfile: vi.fn()
}));

describe('Auth Methods Index', () => {
  it('should correctly export all auth methods', () => {
    // Check if all methods are exported
    expect(authMethods.login).toBe(emailPasswordAuth.login);
    expect(authMethods.register).toBe(emailPasswordAuth.register);
    expect(authMethods.resetPassword).toBe(emailPasswordAuth.resetPassword);
    expect(authMethods.loginWithGoogle).toBe(socialAuth.loginWithGoogle);
    expect(authMethods.logout).toBe(sessionManagement.logout);
    expect(authMethods.verifyAdminCode).toBe(adminAuth.verifyAdminCode);
    expect(authMethods.updateUserProfile).toBe(profileManagement.updateUserProfile);
    expect(authMethods.fetchUserProfile).toBe(profileManagement.fetchUserProfile);
  });
});
