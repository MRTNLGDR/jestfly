
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';

export const AwardForm: React.FC = () => {
  return (
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
  );
};
