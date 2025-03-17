
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionRenderer } from './SectionRenderer';
import { UISchemaSection, UISchemaData } from '../types';

interface AllTabContentProps {
  schemaData: UISchemaData;
  isExporting: boolean;
  exportAsJson: () => void;
}

export const AllTabContent: React.FC<AllTabContentProps> = ({ 
  schemaData, 
  isExporting, 
  exportAsJson 
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle>Documentação UI/UX Completa</CardTitle>
        <CardDescription>
          Visualize todos os elementos de interface do JESTFLY
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {Object.values(schemaData).map((section, index) => (
            <div key={index} className="mb-8">
              <SectionRenderer section={section} />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <Button
          onClick={exportAsJson}
          disabled={isExporting}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isExporting ? (
            <>Exportando...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar Schema Completo (JSON)
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface SingleSectionTabContentProps {
  section: UISchemaSection;
}

export const SingleSectionTabContent: React.FC<SingleSectionTabContentProps> = ({ section }) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>
          {section.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <SectionRenderer section={section} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface CombinedSectionsTabContentProps {
  sections: UISchemaSection[];
  title: string;
  description: string;
}

export const CombinedSectionsTabContent: React.FC<CombinedSectionsTabContentProps> = ({
  sections,
  title,
  description
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {sections.map((section, index) => (
            <SectionRenderer key={index} section={section} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
