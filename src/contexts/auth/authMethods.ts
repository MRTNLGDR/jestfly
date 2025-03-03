
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogleProvider = async () => {
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
      username: user.email?.split('@')[0] || '',
      profileType: 'fan', // Default profile type
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      isVerified: user.emailVerified,
      twoFactorEnabled: false,
      preferences: {
        theme: 'system',
        language: 'en',
        currency: 'USD',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      socialLinks: {},
      collectionItems: []
    });
    
    toast.success('Account created successfully!');
  } else {
    // Update last login time for existing users
    await setDoc(doc(firestore, 'users', user.uid), 
      { lastLogin: new Date() }, 
      { merge: true }
    );
    
    toast.success('Login successful!');
  }

  return result;
};

export const registerUser = async (email: string, password: string, userData: Partial<User>) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  
  // Create user document in Firestore
  await setDoc(doc(firestore, 'users', user.uid), {
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
      language: 'en',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    socialLinks: userData.socialLinks || {},
  });
  
  toast.success('Account created successfully!');
  return result;
};

export const logoutUser = async () => {
  await signOut(auth);
  toast.success('Logged out successfully');
};

export const resetUserPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
  toast.success('Password reset email sent');
};

// Missing import for getDoc
import { getDoc } from 'firebase/firestore';
