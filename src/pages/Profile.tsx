
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import GlassHeader from '@/components/GlassHeader';
import { User, Settings, LogOut, Image, Mail } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, profile, signOut, refreshProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
  });
  
  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        fullName: profile.full_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);
  
  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.fullName,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      
      if (error) {
        throw error;
      }
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <GlassHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left sidebar */}
            <div className="w-full md:w-1/3">
              <Card className="neo-blur border-white/10 bg-black/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 border border-white/10">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white/60" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-medium">{profile?.username || 'User'}</h3>
                    <p className="text-white/60 text-sm mt-1">{user?.email}</p>
                    
                    <div className="w-full mt-6 space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-black/40 border-white/20 hover:bg-white/10">
                        <Settings size={16} className="mr-2" />
                        Account Settings
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start bg-black/40 border-white/20 hover:bg-white/10">
                        <Image size={16} className="mr-2" />
                        Change Avatar
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start bg-black/40 border-white/20 hover:bg-white/10">
                        <Mail size={16} className="mr-2" />
                        Email Preferences
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start mt-4"
                        onClick={signOut}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="w-full md:w-2/3">
              <Card className="neo-blur border-white/10 bg-black/40">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-white/70">
                        Username
                      </label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-white/70">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium text-white/70">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md bg-black/40 border-white/20 p-3 text-sm"
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
