
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Search } from 'lucide-react';
import { Button } from '../../ui/button';
import { useLanguage } from '../../../contexts/language';

// Define the user type
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  balance: number;
  joined: string;
}

interface UsersTabProps {
  users: User[];
}

export const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { formatCurrency, currency, jestCoinInCurrency } = useLanguage();
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">JestCoin User Balances</CardTitle>
        <div className="flex items-center border rounded-md px-3 py-2 bg-background">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="flex-1 bg-transparent border-0 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Balance (J$C)</TableHead>
              <TableHead>Value ({currency})</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="font-mono font-bold">{user.balance}</span>
                </TableCell>
                <TableCell className="font-mono text-sm text-green-400">
                  {formatCurrency(user.balance * jestCoinInCurrency)}
                </TableCell>
                <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
