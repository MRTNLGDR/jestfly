
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/language';
import { AwardForm } from './AwardForm';

// Define the transaction type
export interface Transaction {
  id: string;
  userId: string;
  username: string;
  amount: number;
  type: 'award' | 'purchase' | 'raffle';
  reason: string;
  timestamp: string;
}

interface TransactionsTabProps {
  transactions: Transaction[];
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
  const { formatCurrency, currency, jestCoinInCurrency } = useLanguage();
  
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
    <>
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
      
      <AwardForm />
    </>
  );
};
