
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';

export const authService = {
  async login(email: string, password: string): Promise<FirebaseUser> {
    console.log("Attempting login with:", email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful:", result.user.uid);
    
    // Update last login time
    await setDoc(doc(firestore, 'users', result.user.uid), 
      { lastLogin: new Date() }, 
      { merge: true }
    );
    
    return result.user;
  },

  async loginWithGoogle(): Promise<FirebaseUser> {
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
    
    return user;
  },

  async register(email: string, password: string, userData: Partial<User>): Promise<FirebaseUser> {
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
    
    return user;
  },

  async logout(): Promise<void> {
    console.log("Logging out");
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    console.log("Sending password reset to:", email);
    await sendPasswordResetEmail(auth, email);
  },

  async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return null;
    }
  },

  async updateUserToAdmin(userId: string): Promise<void> {
    await setDoc(doc(firestore, 'users', userId), 
      { 
        profileType: 'admin',
        updatedAt: new Date()
      }, 
      { merge: true }
    );
    console.log("Updated user to admin role");
  },

  async createAdminUser(user: FirebaseUser): Promise<User> {
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
    return newUserData as User;
  }
};
