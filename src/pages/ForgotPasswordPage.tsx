
import React from 'react';
import GlassHeader from '../components/GlassHeader';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '../contexts/auth';

// Menu items for consistent navigation
const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'NFTs', href: '/nfts' },
  { label: 'Events', href: '/events' },
  { label: 'Shop', href: '/shop' },
  { label: 'Community', href: '/community' },
];

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <GlassHeader menuItems={menuItems} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-950 px-4 py-20">
        <Card className="w-full max-w-md bg-black/30 backdrop-blur-md border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Reset Your Password</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Enter your email and we'll send you instructions on how to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-zinc-400">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
