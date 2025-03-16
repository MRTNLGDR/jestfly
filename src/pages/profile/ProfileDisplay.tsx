
import React from 'react';
import { UserProfile } from '../../models/User';
import { Button } from '../../components/ui/button';
import { Undo2 } from 'lucide-react';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import Footer from '../../components/Footer';

interface ProfileDisplayProps {
  profile: UserProfile;
  isCurrentUser: boolean;
  onBack: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ 
  profile, 
  isCurrentUser, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-16">
      <Button
        onClick={onBack}
        className="absolute top-20 left-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
      >
        <Undo2 size={18} />
      </Button>
      
      <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
      <ProfileTabs userId={profile.id} profile={profile} />
      
      <div className="py-12"></div>
      <Footer />
    </div>
  );
};

export default ProfileDisplay;
