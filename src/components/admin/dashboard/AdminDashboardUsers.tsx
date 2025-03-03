
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/ui/loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Trash, 
  Search, 
  UserPlus,
  Shield,
  User,
  Music,
  Users
} from 'lucide-react';
import { ProfileData } from '@/types/auth';

const AdminDashboardUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProfileData[];
    }
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Filter users
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Profile type badge
  const getProfileTypeBadge = (type: string) => {
    switch (type) {
      case 'admin':
        return (
          <Badge className="bg-red-500">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'artist':
        return (
          <Badge className="bg-blue-500">
            <Music className="h-3 w-3 mr-1" />
            Artista
          </Badge>
        );
      case 'collaborator':
        return (
          <Badge className="bg-green-500">
            <Users className="h-3 w-3 mr-1" />
            Colaborador
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500">
            <User className="h-3 w-3 mr-1" />
            Fã
          </Badge>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Gerenciamento de Usuários</h2>
        
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 text-white border-white/10 pl-9"
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loading text="Carregando usuários..." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Nome</TableHead>
                <TableHead className="text-white/70">Email</TableHead>
                <TableHead className="text-white/70">Tipo</TableHead>
                <TableHead className="text-white/70">Criado em</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="font-medium text-white">{user.display_name}</div>
                    <div className="text-white/50 text-xs">@{user.username}</div>
                  </TableCell>
                  <TableCell className="text-white/70">{user.email}</TableCell>
                  <TableCell>
                    {getProfileTypeBadge(user.profile_type)}
                  </TableCell>
                  <TableCell className="text-white/70">{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    {user.is_verified ? (
                      <Badge className="bg-green-600">Verificado</Badge>
                    ) : (
                      <Badge className="bg-yellow-600">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-500 hover:bg-blue-500/10">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardUsers;
