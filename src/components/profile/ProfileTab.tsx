
import React, { useState } from 'react';
import { Edit3, LogOut } from 'lucide-react';
import { User } from '../../models/User';
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileForm from './ProfileForm';

interface ProfileTabProps {
  userData: User;
  formData: {
    displayName: string;
    username: string;
    bio: string;
  };
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onUpdateProfile: (e: React.FormEvent) => void;
  onLogout: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  userData,
  formData,
  loading,
  onInputChange,
  onUpdateProfile,
  onLogout
}) => {
  const [editMode, setEditMode] = useState(false);

  return (
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
            onClick={onLogout} 
            variant="outline" 
            size="icon" 
            className="bg-zinc-900/70 text-red-500 border-zinc-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {!editMode && (
          <ProfileHeader 
            displayName={userData.displayName} 
            username={userData.username}
            avatar={userData.avatar}
            profileType={userData.profileType}
          />
        )}
      </CardHeader>
      
      <CardContent>
        {!editMode ? (
          <ProfileInfo 
            bio={userData.bio || ''}
            email={userData.email}
            createdAt={userData.createdAt}
            lastLogin={userData.lastLogin}
          />
        ) : (
          <ProfileForm 
            formData={formData}
            loading={loading}
            onInputChange={onInputChange}
            onSubmit={onUpdateProfile}
            onCancel={() => setEditMode(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
