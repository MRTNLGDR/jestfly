
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
    profileType: 'fan' as 'fan' | 'artist' | 'collaborator'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileTypeChange = (value: 'fan' | 'artist' | 'collaborator') => {
    setFormData(prev => ({ ...prev, profileType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        username: formData.username,
        profileType: formData.profileType,
      });
      
      toast.success('Account created successfully!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Account created successfully!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Join the JESTFLY community today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Display Name</label>
            <Input
              type="text"
              name="displayName"
              placeholder="Your Name"
              value={formData.displayName}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Username</label>
            <Input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Account Type</label>
            <RadioGroup 
              value={formData.profileType} 
              onValueChange={(value: any) => handleProfileTypeChange(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fan" id="fan" className="border-zinc-600" />
                <Label htmlFor="fan" className="text-zinc-300">Fan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="artist" id="artist" className="border-zinc-600" />
                <Label htmlFor="artist" className="text-zinc-300">Artist</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collaborator" id="collaborator" className="border-zinc-600" />
                <Label htmlFor="collaborator" className="text-zinc-300">Industry Pro</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/30 px-2 text-zinc-400">Or continue with</span>
          </div>
        </div>
        
        <Button 
          onClick={handleGoogleRegister} 
          disabled={isSubmitting}
          variant="outline" 
          className="w-full mt-4 text-white bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
