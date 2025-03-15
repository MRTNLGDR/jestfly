
import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';

interface NFTModelProps {
  modelType: string;
}

const NFTModel: React.FC<NFTModelProps> = ({ modelType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Setup engine and scene
    const engine = new BABYLON.Engine(canvasRef.current, true, { 
      preserveDrawingBuffer: true, 
      stencil: true,
      alpha: true,
    });
    
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
    // Camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 8;
    camera.wheelDeltaPercentage = 0.01;
    
    // Lighting
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5;
    
    const pointLight1 = new BABYLON.PointLight("pointLight1", new BABYLON.Vector3(2, 1, -1), scene);
    pointLight1.diffuse = BABYLON.Color3.FromHexString("#4ade80"); // Neon green
    pointLight1.intensity = 0.8;
    
    const pointLight2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(-2, -1, 1), scene);
    pointLight2.diffuse = BABYLON.Color3.FromHexString("#8B5CF6"); // Purple
    pointLight2.intensity = 0.8;
    
    // Environment for reflections
    try {
      const envTexture = new BABYLON.CubeTexture("/environment.hdr", scene);
      scene.environmentTexture = envTexture;
    } catch (error) {
      console.warn('Environment map failed to load, using fallback lighting');
    }
    
    // Create geometries based on the model type
    let mesh;
    
    switch(modelType) {
      case '001': // Crystal Beast
        mesh = BABYLON.MeshBuilder.CreatePolyhedron("nftModel", { type: 1, size: 1.2 }, scene);
        break;
      case '002': // Sonic Fragment
        mesh = BABYLON.MeshBuilder.CreateTorus("nftModel", { diameter: 2, thickness: 0.5, tessellation: 32 }, scene);
        break;
      case '003': // Digital Relic
        mesh = BABYLON.MeshBuilder.CreateIcoSphere("nftModel", { radius: 1.3, subdivisions: 3 }, scene);
        break;
      default:
        mesh = BABYLON.MeshBuilder.CreateSphere("nftModel", { diameter: 2 }, scene);
    }
    
    // Create different materials based on model type
    const material = new BABYLON.PBRMaterial("nftMaterial", scene);
    
    switch(modelType) {
      case '001': // Crystal Beast - Purple Holographic
        material.albedoColor = BABYLON.Color3.FromHexString("#9b87f5");
        material.metallic = 0.6;
        material.roughness = 0.2;
        material.alpha = 0.9;
        material.emissiveColor = BABYLON.Color3.FromHexString("#8B5CF6");
        material.emissiveIntensity = 0.2;
        material.subSurface.isRefractionEnabled = true;
        material.subSurface.refractionIntensity = 0.8;
        material.iridescence.isEnabled = true;
        material.iridescence.intensity = 0.8;
        break;
      case '002': // Sonic Fragment - Neon Blue Glow
        material.albedoColor = BABYLON.Color3.FromHexString("#0EA5E9");
        material.metallic = 0.9;
        material.roughness = 0.1;
        material.emissiveColor = BABYLON.Color3.FromHexString("#0EA5E9");
        material.emissiveIntensity = 0.5;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 1.0;
        material.clearCoat.roughness = 0.1;
        break;
      case '003': // Digital Relic - Green Matrix
        material.albedoColor = BABYLON.Color3.FromHexString("#4ade80");
        material.metallic = 0.7;
        material.roughness = 0.3;
        material.emissiveColor = BABYLON.Color3.FromHexString("#4ade80");
        material.emissiveIntensity = 0.3;
        material.wireframe = true;
        break;
      default:
        material.albedoColor = BABYLON.Color3.White();
        material.metallic = 0.5;
        material.roughness = 0.5;
    }
    
    material.environmentIntensity = 1.0;
    mesh.material = material;
    
    // Add bloom effect
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene);
    defaultPipeline.bloomEnabled = true;
    defaultPipeline.bloomThreshold = 0.6;
    defaultPipeline.bloomWeight = 0.7;
    defaultPipeline.bloomKernel = 64;
    defaultPipeline.bloomScale = 0.5;
    
    // Animation
    let time = 0;
    scene.onBeforeRenderObservable.add(() => {
      time += 0.01;
      mesh.rotation.y += 0.01;
      mesh.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      // Animate lights for dynamic effects
      pointLight1.position.x = Math.sin(time * 0.7) * 3;
      pointLight1.position.y = Math.cos(time * 0.5) * 3;
      
      pointLight2.position.x = Math.sin(time * 0.3 + 2) * 3;
      pointLight2.position.y = Math.cos(time * 0.4 + 1) * 3;
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
  }, [modelType]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-transparent"
    />
  );
};

export default NFTModel;
