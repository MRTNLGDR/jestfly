
// Stub file for statusService

export const statusService = {
  checkSessionStatus: async () => {
    console.warn('statusService.checkSessionStatus is a stub');
    return { isAuthenticated: false };
  },
};

export const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  console.warn('checkGoogleAuthEnabled is a stub');
  return false;
};
