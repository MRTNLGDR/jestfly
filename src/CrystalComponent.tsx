
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ModelParameters, defaultModelParams } from './types/model';

interface CrystalComponentProps {
  parameters?: Partial<ModelParameters>;
}

const CrystalComponent = ({ parameters = defaultModelParams }: CrystalComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    
    // Advanced lighting setup for neon environment
    const ambientLight = new THREE.AmbientLight(0x222222, parameters.lightIntensity || 0.5);
    scene.add(ambientLight);
    
    // Purple directional light (left side)
    const purpleLight = new THREE.DirectionalLight(0x8B5CF6, parameters.lightIntensity || 2);
    purpleLight.position.set(-5, 3, 5);
    scene.add(purpleLight);
    
    // Green directional light (right side)
    const greenLight = new THREE.DirectionalLight(0x2ecc71, parameters.lightIntensity || 2);
    greenLight.position.set(5, -3, 5);
    scene.add(greenLight);
    
    // Add point lights for extra neon effect
    const purplePointLight = new THREE.PointLight(0xD946EF, 2, 10);
    purplePointLight.position.set(-1, 2, 2);
    scene.add(purplePointLight);
    
    const greenPointLight = new THREE.PointLight(0x4ade80, 2, 10);
    greenPointLight.position.set(2, -1, 3);
    scene.add(greenPointLight);
    
    // Create crystal geometry - using polyhedron for more interesting facets
    // Diamond-like geometry with multiple facets for enhanced refraction effects
    const geometry = new THREE.DodecahedronGeometry(1, 2);
    
    // Load environment map for reflections
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('/envmap/');
    
    // Fallback in case environment map fails to load
    try {
      const envMap = cubeTextureLoader.load([
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg'
      ]);
      
      scene.environment = envMap;
    } catch (error) {
      console.warn('Environment map failed to load, using fallback lighting');
      // Enhance lighting if environment map fails
      const fallbackLight = new THREE.HemisphereLight(0x8B5CF6, 0x2ecc71, 1.5);
      scene.add(fallbackLight);
    }
    
    // Create material with passed parameters and enhanced for hyper-realism
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
      emissive: new THREE.Color(parameters.emissiveColor || '#000000'),
      emissiveIntensity: parameters.emissiveIntensity || 0
    });
    
    // Create crystal mesh and add to scene
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);
    
    // Animation loop with enhanced rotation and pulsing effect
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // More complex rotation for interesting light play
      crystal.rotation.y += 0.005;
      crystal.rotation.x = Math.sin(time * 0.2) * 0.1;
      crystal.rotation.z = Math.cos(time * 0.3) * 0.05;
      
      // Subtle scale pulsing for more dynamic effect
      const scale = 1 + Math.sin(time) * 0.03;
      crystal.scale.set(scale, scale, scale);
      
      // Animate point lights for dynamic reflections
      purplePointLight.position.x = Math.sin(time * 0.7) * 3;
      purplePointLight.position.y = Math.cos(time * 0.5) * 3;
      greenPointLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      greenPointLight.position.y = Math.cos(time * 0.4 + 1) * 3;
      
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
    
    // Cleanup on unmount
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      geometry.dispose();
      material.dispose();
    };
  }, [parameters]);
  
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default CrystalComponent;
