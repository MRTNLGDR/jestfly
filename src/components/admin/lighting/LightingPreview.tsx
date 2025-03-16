
import React, { useState } from 'react';
import { Card } from '../../ui/card';
import CrystalPreview from '../CrystalPreview';
import { ModelParameters, defaultModelParams } from '../../../types/model';
import { useLightingContext } from './LightingContext';

const LightingPreview = () => {
  const { previewParams } = useLightingContext();
  
  return (
    <Card className="glass-morphism overflow-hidden rounded-lg h-[600px]">
      <CrystalPreview parameters={previewParams} />
    </Card>
  );
};

export default LightingPreview;
