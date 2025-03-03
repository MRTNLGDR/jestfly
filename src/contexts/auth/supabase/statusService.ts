
// This file is a placeholder for the Supabase status service
// which has been deprecated in favor of Firebase auth
// It's kept to prevent import errors in existing code

console.warn('The Supabase auth service is deprecated and will be removed in a future version');

export const checkSessionStatus = async () => {
  console.warn('Using deprecated Supabase auth service');
  return null;
};

export const subscribeToAuthChanges = () => {
  console.warn('Using deprecated Supabase auth service');
  return () => {}; // return empty cleanup function
};
