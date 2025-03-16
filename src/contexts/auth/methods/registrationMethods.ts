
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
    
    // Tente criar um perfil para o usuário imediatamente
    if (data.user) {
      console.log("Creating profile for new user:", data.user.id);
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            display_name: userData.display_name || email.split('@')[0],
            username: userData.username || email.split('@')[0],
            profile_type: userData.profile_type || 'fan',
            is_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error("Error creating profile during registration:", profileError);
        } else {
          console.log("Successfully created profile during registration");
        }
      } catch (profileErr) {
        console.error("Exception when creating profile during registration:", profileErr);
      }
    }
    
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
