import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [profileType, setProfileType] = useState<'fan' | 'artist' | 'collaborator' | 'admin'>('fan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const userData = {
          display_name: displayName,
          username: username,
          profile_type: profileType
        };
        const { error } = await signUp(email, password, userData);
        if (error) throw error;
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLogin ? 'Sign In to JESTFLY' : 'Create a JESTFLY Account'}
        </h2>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white/80 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-white/80 mb-2" htmlFor="displayName">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Your display name"
                  required={!isLogin}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white/80 mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="username"
                  required={!isLogin}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white/80 mb-2" htmlFor="profileType">
                  Account Type
                </label>
                <select
                  id="profileType"
                  value={profileType}
                  onChange={(e) => setProfileType(e.target.value as 'fan' | 'artist' | 'collaborator' | 'admin')}
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  required={!isLogin}
                >
                  <option value="fan">Fan</option>
                  <option value="artist">Artist</option>
                  <option value="collaborator">Collaborator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          
          <div className="mb-6">
            <label className="block text-white/80 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
        
        {isLogin && (
          <div className="mt-4 text-center">
            <button className="text-white/60 hover:text-white/80 transition-colors text-sm">
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
