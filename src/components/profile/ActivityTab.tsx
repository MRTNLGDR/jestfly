
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

const ActivityTab: React.FC = () => {
  return (
    <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-zinc-400">
          Platform activity history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-300">Activity history will be available soon.</p>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
