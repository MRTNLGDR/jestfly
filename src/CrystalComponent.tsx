
import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { ModelParameters, defaultModelParams } from './types/model';

interface CrystalComponentProps {
  parameters?: Partial<ModelParameters>;
}

const CrystalComponent = ({ parameters = defaultModelParams }: CrystalComponentProps) => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create engine and scene with alpha (transparency) enabled
    const engine = new BABYLON.Engine(containerRef.current, true, { 
      preserveDrawingBuffer: true, 
      stencil: true,
      alpha: true, // Enable alpha channel for transparent background
    });
    
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Transparent background
    
    // Setup camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(containerRef.current, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 8;
    camera.wheelDeltaPercentage = 0.01;
    
    // Add ambient light
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.3;
    
    // Create neon point lights for the crystal edges with more intensity
    const purplePointLight = new BABYLON.PointLight("purpleLight", new BABYLON.Vector3(-1.5, 2, 2), scene);
    purplePointLight.diffuse = BABYLON.Color3.FromHexString("#8B5CF6"); // Vivid purple
    purplePointLight.intensity = parameters.lightIntensity || 2.0;
    
    const greenPointLight = new BABYLON.PointLight("greenLight", new BABYLON.Vector3(2, -1.5, 2), scene);
    greenPointLight.diffuse = BABYLON.Color3.FromHexString("#4ade80"); // Neon green
    greenPointLight.intensity = parameters.lightIntensity || 2.0;
    
    // Create environment for reflections
    try {
      const envTexture = new BABYLON.CubeTexture("/environment.hdr", scene);
      scene.environmentTexture = envTexture;
    } catch (error) {
      console.warn('Environment map failed to load, using fallback lighting');
      const fallbackLight = new BABYLON.HemisphericLight("fallbackLight", new BABYLON.Vector3(0, 1, 0), scene);
      fallbackLight.intensity = 1.5;
    }
    
    // Create diamond-like crystal geometry (icosahedron is more diamond-like)
    const crystalMesh = BABYLON.MeshBuilder.CreatePolyhedron("crystal", { type: 3, size: 1 }, scene);
    
    // Create advanced PBR material for glass/diamond look
    const crystalMaterial = new BABYLON.PBRMaterial("crystalMaterial", scene);
    
    // Apply glass/diamond parameters to material
    crystalMaterial.albedoColor = BABYLON.Color3.FromHexString(parameters.color || defaultModelParams.color);
    crystalMaterial.metallic = parameters.metalness ?? 0.1;
    crystalMaterial.roughness = parameters.roughness ?? 0.0;
    crystalMaterial.alpha = parameters.opacity ?? 0.9;
    
    // Enable refraction for glass-like effect
    crystalMaterial.subSurface.isRefractionEnabled = true;
    crystalMaterial.subSurface.refractionIntensity = parameters.transmission ?? 0.98;
    crystalMaterial.subSurface.translucencyIntensity = parameters.thickness ?? 0.5;
    
    // Enable clearcoat for extra shine
    crystalMaterial.clearCoat.isEnabled = true;
    crystalMaterial.clearCoat.intensity = parameters.clearcoat ?? 1.0;
    crystalMaterial.clearCoat.roughness = parameters.clearcoatRoughness ?? 0.0;
    
    // Set high index of refraction for diamond-like look
    crystalMaterial.indexOfRefraction = parameters.ior ?? 2.75;
    
    // Add subtle emissive glow
    crystalMaterial.emissiveColor = BABYLON.Color3.FromHexString(parameters.emissiveColor || "#8B5CF6");
    crystalMaterial.emissiveIntensity = parameters.emissiveIntensity || 0.2;
    
    // Enhance environment reflections
    crystalMaterial.environmentIntensity = parameters.envMapIntensity ?? 2.5;
    
    // Add subtle iridescence for rainbow effects under certain angles
    crystalMaterial.iridescence.isEnabled = true;
    crystalMaterial.iridescence.intensity = 0.3;
    
    // Apply material to mesh
    crystalMesh.material = crystalMaterial;
    
    // Add bloom effect for enhanced glow on edges
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene);
    defaultPipeline.bloomEnabled = true;
    defaultPipeline.bloomThreshold = 0.7;
    defaultPipeline.bloomWeight = 0.7;
    defaultPipeline.bloomKernel = 64;
    defaultPipeline.bloomScale = 0.5;
    
    // Animations
    let time = 0;
    scene.onBeforeRenderObservable.add(() => {
      time += 0.01;
      
      // Smooth rotation animation
      crystalMesh.rotation.y += 0.003;
      crystalMesh.rotation.x = Math.sin(time * 0.1) * 0.05;
      crystalMesh.rotation.z = Math.cos(time * 0.15) * 0.02;
      
      // Subtle pulsing scale
      const scale = 1 + Math.sin(time) * 0.01;
      crystalMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
      
      // Animate lights for dynamic reflections
      purplePointLight.position.x = Math.sin(time * 0.7) * 3;
      purplePointLight.position.y = Math.cos(time * 0.5) * 3;
      purplePointLight.intensity = parameters.lightIntensity! * (0.8 + Math.sin(time * 0.3) * 0.2);
      
      greenPointLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      greenPointLight.position.y = Math.cos(time * 0.4 + 1) * 3;
      greenPointLight.intensity = parameters.lightIntensity! * (0.8 + Math.cos(time * 0.5) * 0.2);
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
  
  return <canvas ref={containerRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />;
};

export default CrystalComponent;
