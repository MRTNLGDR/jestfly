
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Login successful for:", email);
    
    // Atualizar o timestamp de último login
    if (data.user) {
      console.log("Updating last login for user:", data.user.id);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
        
      if (updateError) {
        console.error('Erro ao atualizar last_login:', updateError);
      }
    }
    
    toast.success('Login realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

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

export const logoutUser = async () => {
  try {
    console.log("Logging out user");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    console.log("Logout successful");
    toast.success('Logout realizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const resetUserPassword = async (email: string) => {
  try {
    console.log("Requesting password reset for:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Password reset error:", error);
      throw error;
    }
    
    console.log("Password reset email sent to:", email);
    // O toast é feito no componente para melhor feedback visual
    return true;
  } catch (error: any) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    throw error;
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    console.log("Updating user password");
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Update password error:", error);
      throw error;
    }
    
    console.log("Password updated successfully");
    // O toast é feito no componente para melhor feedback visual
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    console.log("Updating profile for user:", userId);
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Update profile error:", error);
      throw error;
    }
    
    console.log("Profile updated successfully");
    toast.success('Perfil atualizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching user data for:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn("No profile found for user:", userId);
        return null;
      }
      console.error("Error fetching user data:", error);
      throw error;
    }
    
    console.log("User data received:", data ? "success" : "not found");
    
    if (data) {
      // Buscar contagens de seguidores e seguindo
      console.log("Fetching followers/following counts");
      
      let followersCount = 0;
      let followingCount = 0;
      
      try {
        const { data: followers, error: followersError } = await supabase
          .rpc('count_followers', { user_id: userId });

        if (followersError) {
          console.error('Erro ao buscar seguidores:', followersError);
        } else {
          followersCount = followers || 0;
        }
      } catch (followerErr) {
        console.error('Exceção ao buscar seguidores:', followerErr);
      }
      
      try {
        const { data: following, error: followingError } = await supabase
          .rpc('count_following', { user_id: userId });

        if (followingError) {
          console.error('Erro ao buscar seguindo:', followingError);
        } else {
          followingCount = following || 0;
        }
      } catch (followingErr) {
        console.error('Exceção ao buscar seguindo:', followingErr);
      }
      
      // Fazendo cast seguro para UserProfile com valores padrão para os campos necessários
      const userProfile: UserProfile = {
        ...data,
        followers_count: followersCount,
        following_count: followingCount,
        is_verified: data.is_verified || false,
        avatar_url: data.avatar || '',  // Map the database 'avatar' field to 'avatar_url'
        // Garantir que social_links seja do tipo correto
        social_links: data.social_links as UserProfile['social_links'] || {},
        // Convertendo o tipo preferences para o formato esperado
        preferences: data.preferences as UserProfile['preferences'] || {
          email_notifications: true,
          push_notifications: true,
          theme: 'dark',
          language: 'pt'
        }
      };
      
      console.log("User profile prepared:", userProfile.display_name);
      return userProfile;
    }
    
    console.log("No user data found for:", userId);
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
