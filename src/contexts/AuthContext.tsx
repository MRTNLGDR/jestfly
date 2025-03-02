
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../models/User';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        try {
          console.log("Fetching user data for:", user.uid);
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          
          // Special case for admin user
          const isAdminEmail = user.email === 'lucas@martynlegrand.com';
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            
            // Auto-assign admin role for specific email if not already set
            if (isAdminEmail && userData.profileType !== 'admin') {
              await setDoc(doc(firestore, 'users', user.uid), 
                { 
                  profileType: 'admin',
                  updatedAt: new Date()
                }, 
                { merge: true }
              );
              console.log("Updated user to admin role");
              userData.profileType = 'admin';
            }
            
            console.log("User data found:", userData);
            setUserData(userData);
          } else if (isAdminEmail) {
            // Create admin user if doesn't exist
            const newUserData = {
              id: user.uid,
              email: user.email,
              displayName: user.displayName || 'Admin User',
              username: 'admin',
              profileType: 'admin',
              createdAt: new Date(),
              updatedAt: new Date(),
              lastLogin: new Date(),
              isVerified: true,
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
            };
            
            await setDoc(doc(firestore, 'users', user.uid), newUserData);
            console.log("Created new admin user");
            setUserData(newUserData as User);
          } else {
            console.log("No user data found");
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
      console.log("Attempting login with:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", result.user.uid);
      
      // Update last login time
      await setDoc(doc(firestore, 'users', result.user.uid), 
        { lastLogin: new Date() }, 
        { merge: true }
      );
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
      console.log("Google login successful:", user.uid);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log("Creating new user data for Google sign-in");
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
        console.log("Updating last login for existing user");
        // Update last login time for existing users
        await setDoc(doc(firestore, 'users', user.uid), 
          { lastLogin: new Date() }, 
          { merge: true }
        );
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      console.log("Attempting to register:", email, userData.profileType);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log("Registration successful:", user.uid);
      
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
      
      console.log("Creating user document:", newUserData);
      await setDoc(doc(firestore, 'users', user.uid), newUserData);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out");
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
      console.log("Sending password reset to:", email);
      await sendPasswordResetEmail(auth, email);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
