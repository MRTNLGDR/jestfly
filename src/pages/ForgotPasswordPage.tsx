
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from 'sonner';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-black to-black -z-10"></div>
        
        {/* Purple glow effect */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[120px] -z-10"></div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Reset Your Password
          </h2>
        </div>
        
        <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">
              {isSuccess ? 'Check Your Email' : 'Forgot Password'}
            </CardTitle>
            <CardDescription className="text-center text-zinc-400">
              {isSuccess 
                ? 'We\'ve sent you an email with password reset instructions.'
                : 'Enter your email and we\'ll send you a password reset link.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-blue-500/10 text-blue-400 p-4 rounded-md text-sm">
                  If your email is registered with us, you'll receive instructions to reset your password shortly.
                </div>
                
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  variant="outline" 
                  className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Send Again
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Link 
              to="/login" 
              className="text-sm text-zinc-400 hover:text-zinc-300 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ForgotPasswordPage;
