
// statusService module

export const checkSessionStatus = async () => {
  console.warn('statusService.checkSessionStatus is a stub');
  return { isAuthenticated: false };
};

export const subscribeToAuthChanges = () => {
  console.warn('statusService.subscribeToAuthChanges is a stub');
  return () => {}; // Return unsubscribe function
};

export const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  console.warn('checkGoogleAuthEnabled is a stub');
  return false;
};

export const statusService = {
  checkSessionStatus,
  subscribeToAuthChanges
};
