
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import NotFoundState from './NotFoundState';
import ProfileDisplay from './ProfileDisplay';
import { useProfileManager } from './hooks/useProfileManager';

interface ProfilePageContainerProps {
  defaultTab?: 'overview' | 'resources' | 'settings';
}

const ProfilePageContainer: React.FC<ProfilePageContainerProps> = ({ 
  defaultTab = 'overview' 
}) => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser, refreshUserData } = useAuth();
  const navigate = useNavigate();
  
  const {
    profile,
    isLoading,
    error,
    isCurrentUser,
    handleRefresh
  } = useProfileManager(userId, currentUser, refreshUserData);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingState onRetry={handleRefresh} />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error}
        onRefresh={handleRefresh}
        onBack={handleBack}
      />
    );
  }

  if (!profile) {
    return (
      <NotFoundState
        onRefresh={handleRefresh}
        onBack={handleBack}
      />
    );
  }

  return (
    <ProfileDisplay
      profile={profile}
      isCurrentUser={isCurrentUser}
      onBack={handleBack}
      defaultTab={defaultTab}
    />
  );
};

export default ProfilePageContainer;
