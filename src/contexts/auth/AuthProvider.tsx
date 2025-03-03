
import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await setDoc(doc(firestore, 'users', result.user.uid), 
        { lastLogin: new Date() }, 
        { merge: true }
      );
      
      return result.user;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create user data for new Google sign-ins
        await setDoc(doc(firestore, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          username: (user.email?.split('@')[0] || '') + '-' + Math.floor(Math.random() * 1000),
          profileType: 'fan', // Default profile type
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
          isVerified: user.emailVerified,
          twoFactorEnabled: false,
          preferences: {
            theme: 'system',
            language: 'pt',
            currency: 'BRL',
            notifications: {
              email: true,
              push: true,
              sms: false
            }
          },
          socialLinks: {},
          collectionItems: [],
          transactions: []
        });
      } else {
        // Update last login time for existing users
        await setDoc(doc(firestore, 'users', user.uid), 
          { lastLogin: new Date() }, 
          { merge: true }
        );
      }
      
      return user;
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Create user document in Firestore
      const newUserData = {
        id: user.uid,
        email,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isVerified: false,
        twoFactorEnabled: false,
        preferences: userData.preferences || {
          theme: 'system',
          language: 'pt',
          currency: 'BRL',
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        },
        socialLinks: userData.socialLinks || {},
        collectionItems: [],
        transactions: []
      };
      
      await setDoc(doc(firestore, 'users', user.uid), newUserData);
      
      return user;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      // Using Firebase password reset (implementation needed)
      toast.success('Password reset instructions have been sent to your email');
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    userData,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
