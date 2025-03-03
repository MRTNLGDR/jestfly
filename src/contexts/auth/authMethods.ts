
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    const userRef = doc(firestore, 'users', result.user.uid);
    await updateDoc(userRef, {
      lastLogin: new Date()
    });
    
    toast.success('Login realizado com sucesso!');
    return result;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, userData: Partial<User>) => {
  try {
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
    
    const profileType = userData.profileType || 'fan';
    toast.success(`Conta de ${profileType === 'artist' ? 'artista' : 
                  profileType === 'admin' ? 'administrador' : 
                  profileType === 'collaborator' ? 'colaborador' : 'fã'} 
                  criada com sucesso!`);
    return result;
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  toast.success('Logout realizado com sucesso');
};

export const resetUserPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
  toast.success('Email de recuperação de senha enviado');
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
    toast.success('Perfil atualizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
