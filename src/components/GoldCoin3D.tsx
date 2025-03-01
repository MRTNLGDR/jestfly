
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface GoldCoin3DProps {
  size?: number;
  className?: string;
}

const GoldCoin3D: React.FC<GoldCoin3DProps> = ({ size = 100, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      size / size, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    
    // Clear any existing canvas
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Create coin geometry
    const coinGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    
    // Load gold texture
    const textureLoader = new THREE.TextureLoader();
    const goldTexture = textureLoader.load('/textures/presets/gold.jpg');
    
    // Create gold material
    const goldMaterial = new THREE.MeshStandardMaterial({
      map: goldTexture,
      metalness: 1,
      roughness: 0.2,
      color: 0xFFD700
    });
    
    // Create cup symbol geometry
    const cupGeometry = new THREE.ConeGeometry(0.7, 1, 16);
    const cupBaseGeometry = new THREE.CylinderGeometry(0.3, 0.7, 0.2, 16);
    const cupStemGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const cupFootGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    
    // Create cup material (gold with different shade)
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFC125,
      metalness: 0.9,
      roughness: 0.3
    });
    
    // Create meshes
    const coinMesh = new THREE.Mesh(coinGeometry, goldMaterial);
    scene.add(coinMesh);
    
    // Position cup parts
    const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
    cupMesh.position.set(0, 0.7, 0);
    cupMesh.rotation.x = Math.PI;
    
    const cupBaseMesh = new THREE.Mesh(cupBaseGeometry, cupMaterial);
    cupBaseMesh.position.set(0, 0.2, 0);
    
    const cupStemMesh = new THREE.Mesh(cupStemGeometry, cupMaterial);
    cupStemMesh.position.set(0, -0.1, 0);
    
    const cupFootMesh = new THREE.Mesh(cupFootGeometry, cupMaterial);
    cupFootMesh.position.set(0, -0.4, 0);
    
    // Create a group for the cup symbol
    const cupGroup = new THREE.Group();
    cupGroup.add(cupMesh);
    cupGroup.add(cupBaseMesh);
    cupGroup.add(cupStemMesh);
    cupGroup.add(cupFootMesh);
    
    // Scale cup symbol to fit on coin
    cupGroup.scale.set(0.5, 0.5, 0.5);
    
    // Position cup on front face of coin
    cupGroup.position.set(0, 0, 1.1);
    scene.add(cupGroup);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xFFD700, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Rotate coin
      coinMesh.rotation.y += 0.01;
      cupGroup.rotation.y += 0.01;
      
      // Slight floating animation
      coinMesh.position.y = Math.sin(time) * 0.1;
      cupGroup.position.y = Math.sin(time) * 0.1 + 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle cleanup
    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, [size]);
  
  return (
    <div 
      ref={containerRef} 
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default GoldCoin3D;
