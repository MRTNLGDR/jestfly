
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Coins, User, ArrowUpRight, ArrowDownRight, Users, Search, CircleDollarSign, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const JestCoinManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { formatCurrency, currency, currencySymbol, jestCoinInCurrency } = useLanguage();
  
  // Sample data for transactions and users
  const transactions = [
    { id: '1', userId: 'user1', username: 'johndoe', amount: 500, type: 'award', reason: 'Community engagement', timestamp: '2023-10-15T14:30:00' },
    { id: '2', userId: 'user2', username: 'janesmith', amount: 150, type: 'purchase', reason: 'Limited edition hoodie', timestamp: '2023-10-14T11:20:00' },
    { id: '3', userId: 'user3', username: 'michaelb', amount: 1000, type: 'award', reason: 'Track submission', timestamp: '2023-10-13T09:45:00' },
    { id: '4', userId: 'user4', username: 'sarahw', amount: 350, type: 'raffle', reason: 'Studio session raffle', timestamp: '2023-10-12T16:10:00' },
    { id: '5', userId: 'user1', username: 'johndoe', amount: 200, type: 'award', reason: 'Social media promotion', timestamp: '2023-10-11T13:25:00' }
  ];
  
  const users = [
    { id: 'user1', username: 'johndoe', fullName: 'John Doe', email: 'john@example.com', balance: 700, joined: '2023-09-01T00:00:00' },
    { id: 'user2', username: 'janesmith', fullName: 'Jane Smith', email: 'jane@example.com', balance: 450, joined: '2023-09-05T00:00:00' },
    { id: 'user3', username: 'michaelb', fullName: 'Michael Brown', email: 'michael@example.com', balance: 1200, joined: '2023-09-10T00:00:00' },
    { id: 'user4', username: 'sarahw', fullName: 'Sarah Wilson', email: 'sarah@example.com', balance: 300, joined: '2023-09-15T00:00:00' },
    { id: 'user5', username: 'roberta', fullName: 'Robert Adams', email: 'robert@example.com', balance: 850, joined: '2023-09-20T00:00:00' }
  ];
  
  // Total JestCoins in circulation
  const totalJestCoins = 3500;
  
  // Calculate total market cap
  const marketCapInCurrency = totalJestCoins * jestCoinInCurrency;
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-yellow-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
              <Coins className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Total JestCoins</p>
              <h3 className="text-2xl font-bold">{totalJestCoins.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-green-500/20 p-3 rounded-full mr-4">
              <CircleDollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">JestCoin Value</p>
              <h3 className="text-2xl font-bold">{formatCurrency(jestCoinInCurrency)}</h3>
              <p className="text-xs text-white/40 mt-1">1 J$C = {formatCurrency(jestCoinInCurrency)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-500/20 p-3 rounded-full mr-4">
              <ArrowRight className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Market Cap</p>
              <h3 className="text-2xl font-bold">{formatCurrency(marketCapInCurrency)}</h3>
              <p className="text-xs text-white/40 mt-1">{totalJestCoins.toLocaleString()} J$C</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-500/20 p-3 rounded-full mr-4">
              <User className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Active Users</p>
              <h3 className="text-2xl font-bold">52</h3>
              <p className="text-xs text-white/40 mt-1">({((52 / 100) * 100).toFixed(0)}% growth)</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount (J$C)</TableHead>
                    <TableHead>Value ({currency})</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === 'award' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          {transaction.amount}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatCurrency(transaction.amount * jestCoinInCurrency)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'award' ? 'bg-green-900/30 text-green-400' :
                          transaction.type === 'purchase' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-purple-900/30 text-purple-400'
                        }`}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Award JestCoins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">User</Label>
                    <Input id="user" placeholder="Username or email" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (J$C)</Label>
                    <Input id="amount" type="number" placeholder="100" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input id="reason" placeholder="Community contribution" />
                  </div>
                  
                  <Button className="w-full">Award JestCoins</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group">Group Award</Label>
                    <select id="group" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                      <option value="">Select a group</option>
                      <option value="recent">Recent signups</option>
                      <option value="active">Most active users</option>
                      <option value="creators">Content creators</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupAmount">Amount per user (J$C)</Label>
                    <Input id="groupAmount" type="number" placeholder="50" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupReason">Reason</Label>
                    <Input id="groupReason" placeholder="Promotional campaign" />
                  </div>
                  
                  <Button className="w-full">Award to Group</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JestCoinManager;
