
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
    
    // Enhanced lighting setup for better crystal realism
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.2; // Reduced ambient for stronger directional highlights
    
    // Create multiple colored lights to enhance refraction effects
    const purplePointLight = new BABYLON.PointLight("purpleLight", new BABYLON.Vector3(-2, 2, 3), scene);
    purplePointLight.diffuse = BABYLON.Color3.FromHexString("#8B5CF6"); // Vivid purple
    purplePointLight.intensity = parameters.lightIntensity || 2.5;
    
    const greenPointLight = new BABYLON.PointLight("greenLight", new BABYLON.Vector3(2, -1.5, 2), scene);
    greenPointLight.diffuse = BABYLON.Color3.FromHexString("#4ade80"); // Neon green
    greenPointLight.intensity = parameters.lightIntensity || 2.5;
    
    // Add blue light for more color variation in reflections
    const bluePointLight = new BABYLON.PointLight("blueLight", new BABYLON.Vector3(0, 3, -2), scene);
    bluePointLight.diffuse = BABYLON.Color3.FromHexString("#60a5fa"); // Bright blue
    bluePointLight.intensity = parameters.lightIntensity ? parameters.lightIntensity * 0.7 : 1.8;
    
    // Create environment for reflections
    try {
      const envTexture = new BABYLON.CubeTexture("/environment.hdr", scene);
      scene.environmentTexture = envTexture;
      scene.environmentIntensity = 1.2; // Increase scene environment intensity for better reflections
    } catch (error) {
      console.warn('Environment map failed to load, using fallback lighting');
      const fallbackLight = new BABYLON.HemisphericLight("fallbackLight", new BABYLON.Vector3(0, 1, 0), scene);
      fallbackLight.intensity = 1.5;
    }
    
    // Create improved crystal geometry - using icosahedron with subdivisions for more facets
    const crystalMesh = BABYLON.MeshBuilder.CreatePolyhedron(
      "crystal", 
      { 
        type: 3, // Icosahedron
        size: 1.2, // Slightly larger
        sizeX: 1.1, // Non-uniform scaling for more interesting shape
        sizeY: 1.3,
        sizeZ: 1.0
      }, 
      scene
    );
    
    // Apply a slight rotation for a more dynamic presentation
    crystalMesh.rotation.x = 0.2;
    crystalMesh.rotation.z = 0.3;
    
    // Create advanced PBR material for glass/diamond look
    const crystalMaterial = new BABYLON.PBRMaterial("crystalMaterial", scene);
    
    // Apply enhanced glass/diamond parameters to material
    crystalMaterial.albedoColor = BABYLON.Color3.FromHexString(parameters.color || "#ffffff");
    crystalMaterial.metallic = parameters.metalness ?? 0.05; // Lower metalness for glass
    crystalMaterial.roughness = parameters.roughness ?? 0.0; // Zero roughness for perfect smoothness
    crystalMaterial.alpha = parameters.opacity ?? 0.85; // Slightly less than fully transparent
    
    // Enable refraction for glass-like effect with enhanced settings
    crystalMaterial.subSurface.isRefractionEnabled = true;
    crystalMaterial.subSurface.refractionIntensity = parameters.transmission ?? 0.98;
    crystalMaterial.subSurface.translucencyIntensity = parameters.thickness ?? 0.7;
    crystalMaterial.subSurface.minimumThickness = 0.1; // Add minimum thickness for better refraction
    crystalMaterial.subSurface.maximumThickness = 5.0; // Increase maximum thickness for deeper look
    
    // Enable clearcoat for extra shine
    crystalMaterial.clearCoat.isEnabled = true;
    crystalMaterial.clearCoat.intensity = parameters.clearcoat ?? 1.0;
    crystalMaterial.clearCoat.roughness = parameters.clearcoatRoughness ?? 0.0;
    
    // Set high index of refraction for diamond-like look
    crystalMaterial.indexOfRefraction = parameters.ior ?? 2.75;
    
    // Add subtle emissive glow to edges
    crystalMaterial.emissiveColor = BABYLON.Color3.FromHexString(parameters.emissiveColor || "#8B5CF6");
    crystalMaterial.emissiveIntensity = parameters.emissiveIntensity || 0.15;
    
    // Enhance environment reflections
    crystalMaterial.environmentIntensity = parameters.envMapIntensity ?? 3.5; // Increased for more dramatic reflections
    
    // Add stronger iridescence for rainbow effects under certain angles
    crystalMaterial.iridescence.isEnabled = true;
    crystalMaterial.iridescence.intensity = parameters.iridescence ?? 0.6; // Increased iridescence
    crystalMaterial.iridescence.indexOfRefraction = parameters.iridescenceIOR ?? 1.8;
    
    // Apply material to mesh
    crystalMesh.material = crystalMaterial;
    
    // Add bloom effect for enhanced glow on edges with improved settings
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene);
    defaultPipeline.bloomEnabled = true;
    defaultPipeline.bloomThreshold = 0.65; // Lower threshold to catch more highlights
    defaultPipeline.bloomWeight = 0.8; // Stronger bloom weight
    defaultPipeline.bloomKernel = 64; // Larger kernel for smoother bloom
    defaultPipeline.bloomScale = 0.6; // Increased scale for more visible bloom
    
    // Add chromatic aberration for a more realistic crystal edge effect
    defaultPipeline.chromaticAberrationEnabled = true;
    defaultPipeline.chromaticAberration.aberrationAmount = 1.0;
    defaultPipeline.chromaticAberration.radialIntensity = 0.5;
    
    // Add subtle grain to simulate microscopic imperfections
    defaultPipeline.grainEnabled = true;
    defaultPipeline.grain.intensity = 5;
    defaultPipeline.grain.animated = true;
    
    // Enhanced animations
    let time = 0;
    scene.onBeforeRenderObservable.add(() => {
      time += 0.008; // Slower rotation for more elegant movement
      
      // Smooth rotation animation with varying speeds
      crystalMesh.rotation.y += 0.002;
      crystalMesh.rotation.x = Math.sin(time * 0.1) * 0.08;
      crystalMesh.rotation.z = Math.cos(time * 0.15) * 0.05;
      
      // Subtle pulsing scale (reduced for more subtlety)
      const scale = 1 + Math.sin(time) * 0.008;
      crystalMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
      
      // Animate lights for dynamic reflections with phase differences
      purplePointLight.position.x = Math.sin(time * 0.7) * 3;
      purplePointLight.position.y = Math.cos(time * 0.5) * 3;
      purplePointLight.intensity = (parameters.lightIntensity || 2.5) * (0.9 + Math.sin(time * 0.3) * 0.1);
      
      greenPointLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      greenPointLight.position.y = Math.cos(time * 0.4 + 1) * 3;
      greenPointLight.intensity = (parameters.lightIntensity || 2.5) * (0.9 + Math.cos(time * 0.5) * 0.1);
      
      bluePointLight.position.z = Math.sin(time * 0.4) * 3;
      bluePointLight.position.x = Math.cos(time * 0.6) * 2;
      bluePointLight.intensity = (parameters.lightIntensity || 2.5) * 0.7 * (0.9 + Math.sin(time * 0.7) * 0.1);
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
