
import React from 'react';
import { Card } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import LightsTab from './tabs/LightsTab';
import EnvironmentTab from './tabs/EnvironmentTab';
import ActionButtons from './ActionButtons';

const LightingControls = () => {
  return (
    <div className="space-y-6">
      <Card className="glass-morphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-gradient">Editor de Iluminação</h3>
        
        <Tabs defaultValue="lights" className="w-full">
          <TabsList className="grid grid-cols-2 gap-2 w-full mb-4">
            <TabsTrigger value="lights" className="data-[state=active]:bg-purple-600">
              Luzes
            </TabsTrigger>
            <TabsTrigger value="environment" className="data-[state=active]:bg-purple-600">
              Ambiente HDR
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lights" className="space-y-6">
            <LightsTab />
          </TabsContent>
          
          <TabsContent value="environment" className="space-y-6">
            <EnvironmentTab />
          </TabsContent>
        </Tabs>
      </Card>
      
      <ActionButtons />
    </div>
  );
};

export default LightingControls;
