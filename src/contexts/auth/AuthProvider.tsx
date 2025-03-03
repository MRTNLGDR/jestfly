import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthContextType, PermissionType } from './types';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetUserPassword,
  updateUserProfile,
  fetchUserData
} from './authMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    return userData?.profileType === 'admin';
  }, [userData]);

  const isArtist = useMemo(() => {
    return userData?.profileType === 'artist';
  }, [userData]);

  const hasPermission = (requiredPermission: PermissionType | PermissionType[]) => {
    if (!userData) return false;
    
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.includes(userData.profileType as PermissionType);
    }
    
    return userData.profileType === requiredPermission;
  };

  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      const refreshedData = await fetchUserData(currentUser.uid);
      if (refreshedData) {
        setUserData(refreshedData);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await loginUser(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      await registerUser(email, password, userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await resetUserPassword(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser || !userData) {
      throw new Error("Usuário não autenticado");
    }

    try {
      await updateUserProfile(currentUser.uid, data);
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    userData,
    login,
    register,
    logout,
    resetPassword,
    loading,
    error,
    updateProfile,
    refreshUserData,
    isAdmin,
    isArtist,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
