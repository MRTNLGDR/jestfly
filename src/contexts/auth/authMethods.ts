
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
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
