
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ModelParameters, defaultModelParams } from '../../types/model';

interface CrystalPreviewProps {
  parameters?: Partial<ModelParameters>;
}

const CrystalPreview: React.FC<CrystalPreviewProps> = ({ 
  parameters = defaultModelParams 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    // Container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    containerRef.current.appendChild(renderer.domElement);
    
    // Orbit controls for interactive preview
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x111111, 0.3);
    scene.add(ambientLight);
    
    // Directional lights for colored edges
    const purpleLight = new THREE.DirectionalLight(0x8B5CF6, parameters.lightIntensity || 3);
    purpleLight.position.set(-5, 3, 5);
    purpleLight.castShadow = true;
    scene.add(purpleLight);
    
    const greenLight = new THREE.DirectionalLight(0x2ecc71, parameters.lightIntensity || 3);
    greenLight.position.set(5, -3, 5);
    greenLight.castShadow = true;
    scene.add(greenLight);
    
    // Point lights for edge highlights
    const purplePointLight = new THREE.PointLight(0xD946EF, 5, 8);
    purplePointLight.position.set(-1.5, 2, 2);
    scene.add(purplePointLight);
    
    const greenPointLight = new THREE.PointLight(0x4ade80, 5, 8);
    greenPointLight.position.set(2, -1.5, 2);
    scene.add(greenPointLight);
    
    // Environment map for reflections
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('/envmap/');
    
    try {
      const envMap = cubeTextureLoader.load([
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg'
      ]);
      
      scene.environment = envMap;
    } catch (error) {
      console.warn('Environment map failed to load, using fallback lighting');
      const fallbackLight = new THREE.HemisphereLight(0x8B5CF6, 0x2ecc71, 1.5);
      scene.add(fallbackLight);
    }
    
    // Create crystal geometry - using diamond-like shape
    const geometry = new THREE.OctahedronGeometry(1, 2);
    
    // Create material with user parameters
    const material = new THREE.MeshPhysicalMaterial({
      color: parameters.color || defaultModelParams.color,
      metalness: parameters.metalness ?? defaultModelParams.metalness,
      roughness: parameters.roughness ?? defaultModelParams.roughness,
      transmission: parameters.transmission ?? defaultModelParams.transmission,
      thickness: parameters.thickness ?? defaultModelParams.thickness,
      envMapIntensity: parameters.envMapIntensity ?? defaultModelParams.envMapIntensity,
      clearcoat: parameters.clearcoat ?? defaultModelParams.clearcoat,
      clearcoatRoughness: parameters.clearcoatRoughness ?? defaultModelParams.clearcoatRoughness,
      ior: parameters.ior ?? defaultModelParams.ior,
      reflectivity: parameters.reflectivity ?? defaultModelParams.reflectivity,
      iridescence: parameters.iridescence ?? defaultModelParams.iridescence,
      iridescenceIOR: parameters.iridescenceIOR ?? defaultModelParams.iridescenceIOR,
      transparent: parameters.transparent ?? defaultModelParams.transparent,
      opacity: parameters.opacity ?? defaultModelParams.opacity,
      wireframe: parameters.wireframe ?? defaultModelParams.wireframe,
      emissive: new THREE.Color(parameters.emissiveColor || defaultModelParams.emissiveColor),
      emissiveIntensity: parameters.emissiveIntensity || defaultModelParams.emissiveIntensity
    });
    
    // Create crystal mesh
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);
    
    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      time += 0.01;
      
      // Subtle automatic rotation when not being manipulated by user
      if (!controls.enabled) {
        crystal.rotation.y += 0.003;
        crystal.rotation.x = Math.sin(time * 0.1) * 0.05;
        crystal.rotation.z = Math.cos(time * 0.15) * 0.02;
      }
      
      // Very subtle scale pulsing for more realistic effect
      const scale = 1 + Math.sin(time) * 0.01;
      crystal.scale.set(scale, scale, scale);
      
      // Animate point lights
      purplePointLight.position.x = Math.sin(time * 0.7) * 3;
      purplePointLight.position.y = Math.cos(time * 0.5) * 3;
      greenPointLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      greenPointLight.position.y = Math.cos(time * 0.4 + 1) * 3;
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      controls.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [parameters]);
  
  return <div ref={containerRef} className="w-full h-full" />;
};

export default CrystalPreview;
