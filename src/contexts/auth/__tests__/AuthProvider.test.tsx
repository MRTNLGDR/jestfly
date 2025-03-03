
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';
import { useAuthState } from '../useAuthState';
import * as authMethods from '../methods';

// Mock auth hooks and methods
vi.mock('../useAuthState', () => ({
  useAuthState: vi.fn()
}));

vi.mock('../methods', () => ({
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  resetPassword: vi.fn(),
  verifyAdminCode: vi.fn()
}));

// Mock React context
vi.mock('react', async () => {
  const actualReact = await vi.importActual('react');
  return {
    ...actualReact,
    createContext: vi.fn().mockReturnValue({
      Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="context-provider">{children}</div>,
    }),
  };
});

describe('AuthProvider', () => {
  const mockUserData = {
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    profileType: 'fan',
  };
  
  const mockAuthState = {
    currentUser: { uid: 'test-user-id' },
    userData: mockUserData,
    loading: false,
    error: null,
    setUserData: vi.fn(),
    setError: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useAuthState as any).mockReturnValue(mockAuthState);
  });

  it('should render children when loading is false', () => {
    const TestChild = () => <div data-testid="test-child">Test Child</div>;
    
    render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should not render children when loading is true', () => {
    (useAuthState as any).mockReturnValue({
      ...mockAuthState,
      loading: true
    });
    
    const TestChild = () => <div data-testid="test-child">Test Child</div>;
    
    render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>
    );
    
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
  });

  it('should provide auth context value with all required methods', () => {
    const contextValueSpy = vi.fn();
    
    // Mock createContext to capture provided value
    const RealReact = vi.importActual('react');
    const mockContext = {
      Provider: ({ value, children }: { value: any, children: React.ReactNode }) => {
        contextValueSpy(value);
        return (RealReact as any).createElement('div', { 'data-testid': 'context-provider' }, children);
      }
    };
    
    ((RealReact as any).createContext as any).mockReturnValue(mockContext);
    
    const TestChild = () => <div>Test Child</div>;
    
    render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>
    );
    
    expect(contextValueSpy).toHaveBeenCalledWith(expect.objectContaining({
      currentUser: mockAuthState.currentUser,
      userData: mockAuthState.userData,
      login: authMethods.login,
      loginWithGoogle: authMethods.loginWithGoogle,
      register: authMethods.register,
      logout: authMethods.logout,
      resetPassword: authMethods.resetPassword,
      loading: false,
      error: null
    }));
  });
});
