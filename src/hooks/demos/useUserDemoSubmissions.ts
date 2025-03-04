
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserDemoSubmissions } from '../../services/demoService';

export const useUserDemoSubmissions = () => {
  const { profile } = useAuth();
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['userDemoSubmissions', profile?.email],
    queryFn: () => getUserDemoSubmissions(profile?.email || ''),
    enabled: !!profile?.email,
  });
  
  return {
    submissions: data?.data || [],
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useUserDemoSubmissions;
