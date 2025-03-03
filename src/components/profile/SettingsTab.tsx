
import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

const SettingsTab: React.FC = () => {
  return (
    <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Manage your preferences and account settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-300">Settings will be available soon.</p>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
