
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../../../models/User';
import { fetchUserProfile } from '../../../services/profileService';
import { forceCreateProfile, attemptProfileFix } from '../../../services/diagnostic';
import { toast } from 'sonner';

export const useProfileManager = (
  userId?: string,
  currentUser?: User | null,
  refreshUserData?: () => Promise<void>
) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [autoRepairAttempted, setAutoRepairAttempted] = useState(false);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Carregando perfil com userId:", userId, "currentUser:", currentUser?.id);
      
      // Se não houver userId no parâmetro, use o ID do usuário atual
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        console.log("Nenhum ID de usuário alvo encontrado");
        setError('Usuário não encontrado');
        setIsLoading(false);
        return;
      }
      
      // Se for uma repetição e ainda não tentamos reparo automático, tente
      if (loadAttempts > 1 && !autoRepairAttempted && targetUserId === currentUser?.id) {
        console.log("Tentando reparo automático de perfil durante carregamento");
        setAutoRepairAttempted(true);
        
        try {
          const repairResult = await attemptProfileFix();
          if (repairResult.success) {
            toast.success("Perfil reparado automaticamente!");
          } else {
            console.warn("Reparo automático mal-sucedido:", repairResult.message);
          }
        } catch (repairError) {
          console.error("Erro durante reparo automático:", repairError);
        }
      }
      
      // Implementar timeout para evitar espera infinita
      const fetchPromise = fetchUserProfile(targetUserId);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo limite excedido ao carregar perfil")), 10000);
      });
      
      // Race entre busca e timeout
      const profileData = await Promise.race([fetchPromise, timeoutPromise])
        .catch(error => {
          console.error("Erro na busca de perfil:", error);
          
          // Verificar erros específicos que requerem tratamento especial
          const errorMsg = error?.message || String(error);
          
          // Se o erro estiver relacionado a recursão infinita, registre para diagnóstico
          if (errorMsg.includes('infinite recursion')) {
            console.error("Recursão infinita detectada na busca de perfil:", error);
            
            // Tentar reparar perfil se este for o usuário atual
            if (currentUser && targetUserId === currentUser.id && !autoRepairAttempted) {
              setAutoRepairAttempted(true);
              toast.info("Problema detectado com seu perfil. Tentando reparar automaticamente...");
              
              return attemptProfileFix()
                .then(result => {
                  if (result.success) {
                    toast.success("Perfil reparado com sucesso!");
                    // Tentar buscar perfil novamente após reparo
                    return fetchUserProfile(targetUserId);
                  }
                  return null;
                })
                .catch(() => null);
            }
          }
          
          // Se o erro estiver relacionado a perfil inexistente e for o usuário atual,
          // tentar criar perfil automaticamente
          if (currentUser && targetUserId === currentUser.id) {
            toast.info("Tentando criar perfil automaticamente...");
            return forceCreateProfile(currentUser)
              .then(result => {
                if (result.success) {
                  toast.success("Perfil criado com sucesso!");
                  // Se a criação do perfil for bem-sucedida, tentar buscá-lo novamente
                  return fetchUserProfile(targetUserId);
                }
                return null;
              })
              .catch(() => null);
          }
          
          return null;
        });
      
      console.log("Dados do perfil recebidos:", profileData);
      
      if (!profileData) {
        console.log("Nenhum dado de perfil encontrado");
        setError('Erro ao buscar dados do usuário. Tente novamente mais tarde.');
        setIsLoading(false);
        return;
      }
      
      setProfile(profileData);
      
      // Verificar se este é o perfil do usuário atual
      setIsCurrentUser(
        !!(currentUser && currentUser.id === profileData.id)
      );
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      setError(`Erro ao buscar dados do usuário: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    // Limpar erros e tentativas anteriores
    setError(null);
    setLoadAttempts(0);
    setAutoRepairAttempted(false);
    
    // Se tivermos a função de atualização do contexto de autenticação, use-a
    if (refreshUserData) {
      refreshUserData().then(() => {
        loadProfile();
      });
    } else {
      loadProfile();
    }
  };

  // Carregar perfil na montagem
  useEffect(() => {
    if (currentUser || userId) {
      loadProfile();
    } else {
      // Se não tivermos um usuário ou userId, não podemos carregar um perfil
      setIsLoading(false);
      setError('Faça login para ver seu perfil');
    }
  }, [userId, currentUser]);

  // Adicionar lógica de repetição se o perfil falhar ao carregar, com backoff progressivo
  useEffect(() => {
    if (error && loadAttempts < 3 && (currentUser || userId)) {
      const backoffTime = Math.min(2000 * Math.pow(2, loadAttempts), 15000); // Backoff exponencial com máximo 15s
      
      const timer = setTimeout(() => {
        console.log(`Tentativa automática ${loadAttempts + 1} de carregar perfil (backoff: ${backoffTime}ms)`);
        setLoadAttempts(prev => prev + 1);
        loadProfile();
      }, backoffTime);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts]);

  return {
    profile,
    isLoading,
    error,
    loadAttempts,
    autoRepairAttempted,
    isCurrentUser,
    loadProfile,
    handleRefresh,
    setLoadAttempts,
    setAutoRepairAttempted
  };
};
