
/**
 * Utilitários para transformar dados do usuário entre Supabase e os modelos de dados da aplicação
 */

import { User } from '../../models/User';

/**
 * Interface representando um usuário autenticado do Supabase
 */
export interface SupabaseAuthUser {
  email: string;
  email_confirmed_at?: string | null;
  [key: string]: any;
}

/**
 * Interface representando os dados de perfil do Supabase
 */
export interface SupabaseProfileData {
  id: string;
  username?: string;
  full_name?: string;
  profile_type?: 'artist' | 'fan' | 'admin' | 'collaborator';
  avatar_url?: string;
  bio?: string;
  social_links?: Record<string, string>;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: Record<string, boolean>;
    language?: string;
    currency?: string;
    [key: string]: any;
  };
  roles?: string[];
  [key: string]: any;
}

/**
 * Transformar dados do usuário Supabase no modelo User da aplicação
 * @param supabaseUser Os dados do usuário da autenticação Supabase
 * @param profileData Os dados do perfil da tabela profiles do Supabase
 * @returns Um objeto usuário conforme o modelo User da aplicação
 */
export const createSupabaseUserData = (
  supabaseUser: SupabaseAuthUser,
  profileData: SupabaseProfileData
): User => {
  // Extrair o username do email se não fornecido
  const usernameFromEmail = supabaseUser.email?.split('@')[0] || '';
  
  // Criar objeto de notificações padrão que atende ao tipo esperado
  const defaultNotifications = {
    email: true,
    push: true,
    sms: false
  };

  // Mesclar notificações do perfil com os padrões para garantir propriedades obrigatórias
  const notificationsWithDefaults = {
    ...defaultNotifications,
    ...(profileData.preferences?.notifications || {})
  };
  
  // Criar um novo objeto User com dados do Supabase
  const user: User = {
    id: profileData.id,
    email: supabaseUser.email,
    displayName: profileData.full_name || usernameFromEmail,
    username: profileData.username || usernameFromEmail,
    profileType: profileData.profile_type || 'fan',
    avatar: profileData.avatar_url,
    bio: profileData.bio,
    socialLinks: profileData.social_links || {},
    walletAddress: profileData.wallet_address,
    createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
    updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
    lastLogin: new Date(),
    isVerified: !!supabaseUser.email_confirmed_at,
    twoFactorEnabled: false,
    preferences: {
      theme: profileData.preferences?.theme || 'system',
      notifications: notificationsWithDefaults,
      language: profileData.preferences?.language || 'en',
      currency: profileData.preferences?.currency || 'USD',
    },
    roles: profileData.roles || [],
  };
  
  return user;
};

/**
 * Transformar modelo User da aplicação para o formato de perfil Supabase para atualizações
 * @param userData Dados do usuário do modelo User da aplicação
 * @returns Objeto formatado para atualizações de perfil do Supabase
 */
export const prepareUserDataForSupabase = (userData: Partial<User>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // Mapear campos com nomes diferentes
  if (userData.displayName !== undefined) {
    result.full_name = userData.displayName;
  }
  
  if (userData.avatar !== undefined) {
    result.avatar_url = userData.avatar;
  }
  
  if (userData.profileType !== undefined) {
    result.profile_type = userData.profileType;
  }
  
  if (userData.socialLinks !== undefined) {
    result.social_links = userData.socialLinks;
  }
  
  if (userData.walletAddress !== undefined) {
    result.wallet_address = userData.walletAddress;
  }
  
  // Copiar campos com o mesmo nome
  const directFields = ['username', 'bio', 'preferences'];
  
  directFields.forEach(field => {
    if (userData[field as keyof Partial<User>] !== undefined) {
      result[field] = userData[field as keyof Partial<User>];
    }
  });
  
  return result;
};
