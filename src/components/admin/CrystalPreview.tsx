
import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { ModelParameters, defaultModelParams } from '../../types/model';

interface CrystalPreviewProps {
  parameters?: Partial<ModelParameters>;
}

const CrystalPreview: React.FC<CrystalPreviewProps> = ({ 
  parameters = defaultModelParams 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create engine and scene
    const engine = new BABYLON.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.05, 1);
    
    // Setup camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 8;
    camera.wheelDeltaPercentage = 0.01;
    
    // Add lights
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.3;
    
    // Create point lights for the crystal edges
    const purplePointLight = new BABYLON.PointLight("purpleLight", new BABYLON.Vector3(-1.5, 2, 2), scene);
    purplePointLight.diffuse = BABYLON.Color3.FromHexString(parameters.emissiveColor || defaultModelParams.emissiveColor);
    purplePointLight.intensity = parameters.lightIntensity || defaultModelParams.lightIntensity;
    
    const greenPointLight = new BABYLON.PointLight("greenLight", new BABYLON.Vector3(2, -1.5, 2), scene);
    greenPointLight.diffuse = BABYLON.Color3.FromHexString("#4ade80");
    greenPointLight.intensity = parameters.lightIntensity || defaultModelParams.lightIntensity;
    
    // Create environment
    try {
      const envTexture = new BABYLON.CubeTexture("/environment.hdr", scene);
      scene.environmentTexture = envTexture;
    } catch (error) {
      console.warn('Environment map failed to load, using fallback lighting');
      const fallbackLight = new BABYLON.HemisphericLight("fallbackLight", new BABYLON.Vector3(0, 1, 0), scene);
      fallbackLight.intensity = 1.5;
    }
    
    // Create crystal geometry
    const crystalMesh = BABYLON.MeshBuilder.CreatePolyhedron("crystal", { type: 1, size: 1 }, scene);
    
    // Create material
    const crystalMaterial = new BABYLON.PBRMaterial("crystalMaterial", scene);
    
    // Apply parameters to material
    crystalMaterial.albedoColor = BABYLON.Color3.FromHexString(parameters.color || defaultModelParams.color);
    crystalMaterial.metallic = parameters.metalness ?? defaultModelParams.metalness;
    crystalMaterial.roughness = parameters.roughness ?? defaultModelParams.roughness;
    crystalMaterial.alpha = parameters.opacity ?? defaultModelParams.opacity;
    crystalMaterial.subSurface.isRefractionEnabled = true;
    crystalMaterial.subSurface.refractionIntensity = parameters.transmission ?? defaultModelParams.transmission;
    crystalMaterial.subSurface.translucencyIntensity = parameters.thickness ?? defaultModelParams.thickness;
    crystalMaterial.clearCoat.isEnabled = (parameters.clearcoat ?? defaultModelParams.clearcoat) > 0;
    crystalMaterial.clearCoat.roughness = parameters.clearcoatRoughness ?? defaultModelParams.clearcoatRoughness;
    crystalMaterial.indexOfRefraction = parameters.ior ?? defaultModelParams.ior;
    crystalMaterial.emissiveColor = BABYLON.Color3.FromHexString(parameters.emissiveColor || defaultModelParams.emissiveColor);
    crystalMaterial.emissiveIntensity = parameters.emissiveIntensity || defaultModelParams.emissiveIntensity;
    crystalMaterial.environmentIntensity = parameters.envMapIntensity ?? defaultModelParams.envMapIntensity;
    crystalMaterial.wireframe = parameters.wireframe ?? defaultModelParams.wireframe;
    
    // Apply material to mesh
    crystalMesh.material = crystalMaterial;
    
    // Animations
    let time = 0;
    scene.onBeforeRenderObservable.add(() => {
      time += 0.01;
      
      // Slow rotation
      crystalMesh.rotation.y += 0.003;
      crystalMesh.rotation.x = Math.sin(time * 0.1) * 0.05;
      crystalMesh.rotation.z = Math.cos(time * 0.15) * 0.02;
      
      // Subtle pulsing scale
      const scale = 1 + Math.sin(time) * 0.01;
      crystalMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
      
      // Animate lights
      purplePointLight.position.x = Math.sin(time * 0.7) * 3;
      purplePointLight.position.y = Math.cos(time * 0.5) * 3;
      greenPointLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      greenPointLight.position.y = Math.cos(time * 0.4 + 1) * 3;
    });
    
    // Handle resize
    const handleResize = () => {
      engine.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start rendering
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [parameters]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CrystalPreview;
