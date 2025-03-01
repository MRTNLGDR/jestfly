
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { JestCoinStats } from './JestCoinStats';
import { TransactionsTab, Transaction } from './TransactionsTab';
import { UsersTab, User } from './UsersTab';

const JestCoinManager: React.FC = () => {
  // Sample data for transactions and users
  const transactions: Transaction[] = [
    { id: '1', userId: 'user1', username: 'johndoe', amount: 500, type: 'award', reason: 'Community engagement', timestamp: '2023-10-15T14:30:00' },
    { id: '2', userId: 'user2', username: 'janesmith', amount: 150, type: 'purchase', reason: 'Limited edition hoodie', timestamp: '2023-10-14T11:20:00' },
    { id: '3', userId: 'user3', username: 'michaelb', amount: 1000, type: 'award', reason: 'Track submission', timestamp: '2023-10-13T09:45:00' },
    { id: '4', userId: 'user4', username: 'sarahw', amount: 350, type: 'raffle', reason: 'Studio session raffle', timestamp: '2023-10-12T16:10:00' },
    { id: '5', userId: 'user1', username: 'johndoe', amount: 200, type: 'award', reason: 'Social media promotion', timestamp: '2023-10-11T13:25:00' }
  ];
  
  const users: User[] = [
    { id: 'user1', username: 'johndoe', fullName: 'John Doe', email: 'john@example.com', balance: 700, joined: '2023-09-01T00:00:00' },
    { id: 'user2', username: 'janesmith', fullName: 'Jane Smith', email: 'jane@example.com', balance: 450, joined: '2023-09-05T00:00:00' },
    { id: 'user3', username: 'michaelb', fullName: 'Michael Brown', email: 'michael@example.com', balance: 1200, joined: '2023-09-10T00:00:00' },
    { id: 'user4', username: 'sarahw', fullName: 'Sarah Wilson', email: 'sarah@example.com', balance: 300, joined: '2023-09-15T00:00:00' },
    { id: 'user5', username: 'roberta', fullName: 'Robert Adams', email: 'robert@example.com', balance: 850, joined: '2023-09-20T00:00:00' }
  ];
  
  // Total JestCoins in circulation
  const totalJestCoins = 3500;
  
  // Active users count
  const activeUsersCount = 52;
  
  return (
    <div className="space-y-6">
      <JestCoinStats 
        totalJestCoins={totalJestCoins}
        activeUsers={activeUsersCount}
      />
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-6">
          <TransactionsTab transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UsersTab users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JestCoinManager;
