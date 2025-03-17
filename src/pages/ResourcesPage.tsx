
import React from 'react';
import ProfilePageContainer from './profile/ProfilePageContainer';
import UISchemaExporter from '@/components/ui/design-export/UISchemaExporter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ResourcesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-black/30 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">JESTFLY UI Resources</CardTitle>
          <CardDescription>
            Documentação e recursos de design para o sistema JESTFLY
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UISchemaExporter />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesPage;
