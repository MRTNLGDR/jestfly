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
    scene.background = new THREE.Color(0x0a0a0a); // Extremely dark background
    
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
    renderer.toneMappingExposure = 1.5; // Slightly increased exposure
    containerRef.current.appendChild(renderer.domElement);
    
    // Minimal ambient light to keep the center darker
    const ambientLight = new THREE.AmbientLight(0x111111, 0.3); // Reduced intensity
    scene.add(ambientLight);
    
    // Purple directional light (left side) - more focused on edges
    const purpleLight = new THREE.DirectionalLight(0x8B5CF6, parameters.lightIntensity || 3);
    purpleLight.position.set(-5, 3, 5);
    purpleLight.castShadow = true;
    scene.add(purpleLight);
    
    // Green directional light (right side) - more focused on edges
    const greenLight = new THREE.DirectionalLight(0x2ecc71, parameters.lightIntensity || 3);
    greenLight.position.set(5, -3, 5);
    greenLight.castShadow = true;
    scene.add(greenLight);
    
    // Add more focused point lights for neon edge effect
    const purplePointLight = new THREE.PointLight(0xD946EF, 5, 8); // Increased intensity, reduced distance
    purplePointLight.position.set(-1.5, 2, 2);
    scene.add(purplePointLight);
    
    const greenPointLight = new THREE.PointLight(0x4ade80, 5, 8); // Increased intensity, reduced distance
    greenPointLight.position.set(2, -1.5, 2);
    scene.add(greenPointLight);
    
    // Add extra small point lights to enhance edges
    const edgeLight1 = new THREE.PointLight(0xD946EF, 2, 3);
    edgeLight1.position.set(-1, -1, 2);
    scene.add(edgeLight1);
    
    const edgeLight2 = new THREE.PointLight(0x4ade80, 2, 3);
    edgeLight2.position.set(1, 1, 2);
    scene.add(edgeLight2);
    
    // Create crystal geometry with more defined edges
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
    
    // Create material with enhanced contrast and edge definition
    const material = new THREE.MeshPhysicalMaterial({
      color: parameters.color || defaultModelParams.color,
      metalness: parameters.metalness ?? 0.2, // Slightly increased for edge highlights
      roughness: parameters.roughness ?? 0.01, // Ultra-smooth for sharp reflections
      transmission: parameters.transmission ?? 0.95, // High transmission
      thickness: parameters.thickness ?? 1.0, // Increased thickness
      envMapIntensity: parameters.envMapIntensity ?? 3.5, // Increased for more pronounced reflections
      clearcoat: parameters.clearcoat ?? 1.0, // Maximum clearcoat
      clearcoatRoughness: parameters.clearcoatRoughness ?? 0.0, // Smooth clearcoat
      ior: parameters.ior ?? 2.5, // Higher IOR for more dramatic refraction
      reflectivity: parameters.reflectivity ?? 1.0, // Maximum reflectivity
      iridescence: parameters.iridescence ?? 1.0, // Maximum iridescence
      iridescenceIOR: parameters.iridescenceIOR ?? 2.0, // Enhanced iridescence refraction
      transparent: parameters.transparent ?? true,
      opacity: parameters.opacity ?? 0.65, // Slightly reduced for better edge visibility
      wireframe: parameters.wireframe ?? false,
      emissive: new THREE.Color(parameters.emissiveColor || '#000000'),
      emissiveIntensity: parameters.emissiveIntensity || 0.1 // Slight emission for edge glow
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
      
      // Animate point lights for dynamic edge lighting
      purplePointLight.position.x = Math.sin(time * 0.7) * 3;
      purplePointLight.position.y = Math.cos(time * 0.5) * 3;
      greenPointLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      greenPointLight.position.y = Math.cos(time * 0.4 + 1) * 3;
      
      // Animate edge lights for more dynamic highlights
      edgeLight1.position.x = Math.sin(time * 0.4) * 2;
      edgeLight1.position.y = Math.cos(time * 0.6) * 2;
      edgeLight2.position.x = Math.sin(time * 0.5 + 1) * 2;
      edgeLight2.position.y = Math.cos(time * 0.7 + 2) * 2;
      
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
