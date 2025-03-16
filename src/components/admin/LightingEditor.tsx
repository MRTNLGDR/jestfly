
import React from 'react';
import { LightingProvider } from './lighting/LightingContext';
import LightingEditor from './lighting/LightingEditor';

const LightingEditorWrapper = () => {
  return (
    <LightingProvider>
      <LightingEditor />
    </LightingProvider>
  );
};

export default LightingEditorWrapper;
