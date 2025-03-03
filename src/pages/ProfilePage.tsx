
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from 'sonner';
import ProfileTab from '../components/profile/ProfileTab';
import SettingsTab from '../components/profile/SettingsTab';
import ActivityTab from '../components/profile/ActivityTab';
import NotLoggedInView from '../components/profile/NotLoggedInView';

const ProfilePage: React.FC = () => {
  const { currentUser, userData, logout, updateProfile, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
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
    return <NotLoggedInView />;
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
          <ProfileTab 
            userData={userData}
            formData={formData}
            loading={loading}
            onInputChange={handleInputChange}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
