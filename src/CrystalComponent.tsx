
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
      antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, parameters.lightIntensity || 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, parameters.lightIntensity || 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Load environment map for reflections
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('/envmap/');
    const envMap = cubeTextureLoader.load([
      'px.jpg', 'nx.jpg',
      'py.jpg', 'ny.jpg',
      'pz.jpg', 'nz.jpg'
    ]);
    
    // Create crystal geometry
    const geometry = new THREE.OctahedronGeometry(1, 0);
    
    // Create material with passed parameters
    const material = new THREE.MeshPhysicalMaterial({
      color: parameters.color || defaultModelParams.color,
      metalness: parameters.metalness ?? defaultModelParams.metalness,
      roughness: parameters.roughness ?? defaultModelParams.roughness,
      transmission: parameters.transmission ?? defaultModelParams.transmission,
      thickness: parameters.thickness ?? defaultModelParams.thickness,
      envMap: envMap,
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
    });
    
    // Create crystal mesh and add to scene
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate crystal
      crystal.rotation.y += 0.01;
      crystal.rotation.x += 0.005;
      
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
