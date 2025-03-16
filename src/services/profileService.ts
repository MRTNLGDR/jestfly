
// This file now serves as a point of entry for the services of profile
// reorganized in modules smaller for greater maintainability

export {
  fetchUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  checkIfFollowing,
  fetchUserPosts
} from './profile';

// Export types for better type checking across the application
export type { FollowResult } from './profile/types';
