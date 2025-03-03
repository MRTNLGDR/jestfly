
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { UserCircle, LogOut, Settings, Edit3, Calendar, Clock, Mail, User } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser, userData, logout, updateProfile, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        username: userData.username || '',
        bio: userData.bio || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.username) {
      toast.error('Name and username are required');
      return;
    }
    
    setLoading(true);
    
    try {
      await updateProfile({
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio,
      });
      
      setEditMode(false);
      await refreshUserData();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  if (!currentUser || !userData) {
    return (
      <div className="container mx-auto py-20">
        <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
            <CardDescription className="text-zinc-400">
              You need to be logged in to view this page.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 bg-zinc-900/80 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
            <CardHeader className="relative">
              <div className="absolute right-4 top-4 flex space-x-2">
                {!editMode ? (
                  <Button 
                    onClick={() => setEditMode(true)} 
                    variant="outline" 
                    size="icon"
                    className="bg-zinc-900/70 text-white border-zinc-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                ) : null}
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="icon" 
                  className="bg-zinc-900/70 text-red-500 border-zinc-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userData.avatar || ''} alt={userData.displayName} />
                  <AvatarFallback className="bg-purple-800 text-2xl">
                    {userData.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {!editMode ? (
                  <>
                    <CardTitle className="text-2xl font-bold text-white">
                      {userData.displayName}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      @{userData.username}
                    </CardDescription>
                    <div className="px-4 py-1 mt-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-xs font-medium text-white">
                      {userData.profileType === 'admin' ? 'Administrator' : 
                       userData.profileType === 'artist' ? 'Artist' :
                       userData.profileType === 'collaborator' ? 'Collaborator' : 'Fan'}
                    </div>
                  </>
                ) : null}
              </div>
            </CardHeader>
            
            <CardContent>
              {!editMode ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-purple-400" />
                      Bio
                    </h3>
                    <p className="text-zinc-400 pl-6">
                      {userData.bio || 'No bio defined yet.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-purple-400" />
                      Email
                    </h3>
                    <p className="text-zinc-400 pl-6">{userData.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                      Member since
                    </h3>
                    <p className="text-zinc-400 pl-6">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-purple-400" />
                      Last login
                    </h3>
                    <p className="text-zinc-400 pl-6">
                      {userData.lastLogin 
                        ? `${new Date(userData.lastLogin).toLocaleDateString()} at ${new Date(userData.lastLogin).toLocaleTimeString()}`
                        : 'No login information available'}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Display Name</label>
                    <Input
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="bg-zinc-900/60 border-zinc-800 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Username</label>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-zinc-900/60 border-zinc-800 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Bio</label>
                    <Input
                      as="textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-zinc-900/60 border-zinc-800 text-white min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      onClick={() => setEditMode(false)}
                      variant="outline"
                      className="bg-zinc-900/70 text-white border-zinc-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    >
                      {loading ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Manage your preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300">Settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-zinc-400">
                Platform activity history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300">Activity history will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
