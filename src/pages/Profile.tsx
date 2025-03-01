
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';

const Profile = () => {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    avatarUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url || ''
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

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-white/60">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <GlassHeader />
      
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-24 h-24 mb-6">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile?.full_name || 'User'} />
            ) : (
              <AvatarFallback className="bg-purple-900 text-xl">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          
          <Card className="w-full bg-black/40 backdrop-blur-md border-gray-800">
            <CardHeader>
              <CardTitle className="text-center">Your Profile</CardTitle>
              <CardDescription className="text-center">
                View and manage your JESTFLY profile
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="bg-black/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-black/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="bg-black/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">Avatar URL</label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      className="bg-black/50"
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Email</h3>
                      <p className="mt-1">{user?.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Full Name</h3>
                      <p className="mt-1">{profile?.full_name || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Username</h3>
                      <p className="mt-1">{profile?.username || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Member Since</h3>
                      <p className="mt-1">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Bio</h3>
                    <p className="mt-1">{profile?.bio || 'No bio yet'}</p>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <Button onClick={() => setIsEditing(true)} className="flex-1">
                      Edit Profile
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} className="flex-1">
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
