
import React from 'react';
import { UISchemaSection } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SectionRendererProps {
  section: UISchemaSection;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-medium">{section.title}</h3>
      <p className="text-sm text-white/70">{section.description}</p>
      
      <div className="grid grid-cols-1 gap-4">
        {section.items.map((item, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{item.type}</span>
              </CardTitle>
              {item.description && (
                <CardDescription className="text-xs">{item.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              {item.value && (
                <div className="text-xs bg-black/40 p-2 rounded-md font-mono">
                  {item.value}
                </div>
              )}
              
              {item.className && (
                <div className="flex items-center mt-2">
                  <span className="text-xs text-white/60">Classe:</span>
                  <code className="text-xs ml-2 px-1 py-0.5 bg-purple-500/20 rounded">{item.className}</code>
                </div>
              )}
              
              {item.component && (
                <div className="flex items-center mt-2">
                  <span className="text-xs text-white/60">Componente:</span>
                  <code className="text-xs ml-2 px-1 py-0.5 bg-blue-500/20 rounded">{item.component}</code>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
