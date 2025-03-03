
import { User as FirebaseUser } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth, firestore } from '../../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../../../models/User';

export interface FirebaseAuthState {
  currentUser: FirebaseUser | null;
  firebaseUserData: User | null;
}

/**
 * Hook para gerenciar a autenticação com Firebase
 */
export const useFirebaseAuth = (): FirebaseAuthState & { 
  setFirebaseUserData: (data: User | null) => void 
} => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [firebaseUserData, setFirebaseUserData] = useState<User | null>(null);

  useEffect(() => {
    // Verificação de autenticação do Firebase
    const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      
      // Se há um usuário do Firebase, buscar seus dados
      if (firebaseUser && !firebaseUserData) {
        try {
          // Buscar dados do usuário no Firestore
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // Configurar os dados do usuário do Firebase
            setFirebaseUserData(userDoc.data() as User);
          }
        } catch (err) {
          console.error("Error fetching user data from Firebase:", err);
        }
      }
    });
    
    // Limpar inscrição ao desmontar
    return () => {
      unsubscribeFirebase();
    };
  }, [firebaseUserData]);
  
  return {
    currentUser,
    firebaseUserData,
    setFirebaseUserData
  };
};
