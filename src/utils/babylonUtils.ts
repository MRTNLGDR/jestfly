
import * as BABYLON from '@babylonjs/core';
import { ModelParameters } from '../types/model';

export const setupBabylonScene = (
  canvas: HTMLCanvasElement,
  parameters: ModelParameters
): { scene: BABYLON.Scene; engine: BABYLON.Engine; cleanup: () => void } => {
  // Create engine and scene
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.05, 1);
  
  // Setup camera
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 3;
  camera.upperRadiusLimit = 8;
  camera.wheelDeltaPercentage = 0.01;
  
  // Handle resize
  const handleResize = () => {
    engine.resize();
  };
  
  window.addEventListener('resize', handleResize);
  
  // Create cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    scene.dispose();
    engine.dispose();
  };
  
  return { scene, engine, cleanup };
};
