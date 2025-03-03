
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  profile_type: string;
  created_at: string;
  last_login: string | null;
  is_verified: boolean;
}

const AdminDashboardUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    }
  });

  const filteredProfiles = profiles?.filter(profile => 
    profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date to a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Get profile type badge color
  const getProfileTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-500';
      case 'collaborator': return 'bg-purple-500';
      case 'artist': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h2>
        <div className="w-full md:w-auto">
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/20 border-white/10 text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loading text="Carregando usuários..." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/70 font-medium">Usuário</th>
                <th className="text-left p-4 text-white/70 font-medium">Email</th>
                <th className="text-left p-4 text-white/70 font-medium">Tipo</th>
                <th className="text-left p-4 text-white/70 font-medium">Criado em</th>
                <th className="text-left p-4 text-white/70 font-medium">Último login</th>
                <th className="text-left p-4 text-white/70 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles?.map(profile => (
                <tr key={profile.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">
                    <div className="font-medium">{profile.display_name}</div>
                    <div className="text-sm text-white/50">@{profile.username}</div>
                  </td>
                  <td className="p-4 text-white">{profile.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getProfileTypeColor(profile.profile_type)}`}>
                      {profile.profile_type}
                    </span>
                  </td>
                  <td className="p-4 text-white/70">{formatDate(profile.created_at)}</td>
                  <td className="p-4 text-white/70">{formatDate(profile.last_login)}</td>
                  <td className="p-4 text-white/70">
                    {profile.is_verified ? (
                      <span className="text-green-400">Verificado</span>
                    ) : (
                      <span className="text-yellow-400">Não verificado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardUsers;
