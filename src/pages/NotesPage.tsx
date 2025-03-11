
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-gradient-primary mb-6">CreativeFlow Board</h1>
      
      <Tabs defaultValue="notes" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="board">Collaboration Board</TabsTrigger>
          <TabsTrigger value="zettelkasten">Zettelkasten</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="space-y-4">
          <Card className="p-6 neo-blur">
            <h2 className="text-xl font-medium mb-4">My Notes</h2>
            <p className="text-white/70">
              Welcome to the Notes section. Here you can create, edit, and organize your creative notes.
            </p>
            {/* Note content will be added in future implementation */}
          </Card>
        </TabsContent>
        
        <TabsContent value="board" className="space-y-4">
          <Card className="p-6 neo-blur">
            <h2 className="text-xl font-medium mb-4">Collaboration Board</h2>
            <p className="text-white/70">
              Use this visual workspace to collaborate with your team on creative projects.
            </p>
            {/* Board content will be added in future implementation */}
          </Card>
        </TabsContent>
        
        <TabsContent value="zettelkasten" className="space-y-4">
          <Card className="p-6 neo-blur">
            <h2 className="text-xl font-medium mb-4">Zettelkasten System</h2>
            <p className="text-white/70">
              Connect your ideas using the Zettelkasten method for better knowledge management.
            </p>
            {/* Zettelkasten content will be added in future implementation */}
          </Card>
        </TabsContent>
        
        <TabsContent value="automation" className="space-y-4">
          <Card className="p-6 neo-blur">
            <h2 className="text-xl font-medium mb-4">Workflow Automation</h2>
            <p className="text-white/70">
              Set up automations to streamline your creative workflow and save time.
            </p>
            {/* Automation content will be added in future implementation */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotesPage;
