
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../models/User';
import { toast } from 'sonner';

/**
 * Registers a new user
 */
export const registerUser = async (email: string, password: string, userData: Partial<UserProfile>) => {
  try {
    console.log("Registering new user:", email, "with profile type:", userData.profile_type);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: userData.display_name,
          username: userData.username,
          profileType: userData.profile_type || 'fan',
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      throw error;
    }
    
    console.log("Registration successful for:", email);
    
    const profileType = userData.profile_type || 'fan';
    toast.success(`Conta de ${profileType === 'artist' ? 'artista' : 
                  profileType === 'admin' ? 'administrador' : 
                  profileType === 'collaborator' ? 'colaborador' : 'fã'} 
                  criada com sucesso!`);
    return data;
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
};
