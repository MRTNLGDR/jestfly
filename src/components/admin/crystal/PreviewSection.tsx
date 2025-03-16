
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import CrystalPreview from '../CrystalPreview';
import { ModelParameters } from '../../../types/model';

interface PreviewSectionProps {
  parameters: ModelParameters;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ parameters }) => {
  return (
    <Card className="glass-morphism lg:col-span-1 h-[400px] lg:h-[700px] overflow-hidden">
      <CardContent className="p-0 h-full">
        <CrystalPreview parameters={parameters} />
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
