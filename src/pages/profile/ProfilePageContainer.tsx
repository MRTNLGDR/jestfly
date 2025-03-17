
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { UserProfile } from '../../models/User';
import { fetchUserProfile } from '../../services/profileService';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import NotFoundState from './NotFoundState';
import ProfileDisplay from './ProfileDisplay';
import { useProfileManager } from './hooks/useProfileManager';

const ProfilePageContainer: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser, refreshUserData } = useAuth();
  const navigate = useNavigate();
  
  const {
    profile,
    isLoading,
    error,
    loadAttempts,
    autoRepairAttempted,
    isCurrentUser,
    loadProfile,
    handleRefresh,
    setLoadAttempts,
    setAutoRepairAttempted
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
        userId={userId}
        currentUserId={currentUser?.id}
        onRefresh={handleRefresh}
        onBack={handleBack}
      />
    );
  }

  if (!profile) {
    return (
      <NotFoundState
        userId={userId}
        currentUserId={currentUser?.id}
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
    />
  );
};

export default ProfilePageContainer;
