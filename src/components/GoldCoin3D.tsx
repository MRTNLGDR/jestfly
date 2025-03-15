
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
    
    // Create gold material with rich, metallic appearance
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700, // Bright gold color
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 1.5
    });
    
    // Create darker gold material for spade symbol
    const darkGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37, // Darker gold color
      metalness: 0.9,
      roughness: 0.2
    });
    
    // Create coin mesh
    const coinMesh = new THREE.Mesh(coinGeometry, goldMaterial);
    scene.add(coinMesh);
    
    // Create spade symbol
    const spadeGroup = new THREE.Group();
    
    // Spade top (heart upside-down)
    const spadeTopGeometry = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const spadeTop = new THREE.Mesh(spadeTopGeometry, darkGoldMaterial);
    spadeTop.scale.set(1, 1.3, 0.8);
    spadeTop.position.set(0, 0.2, 0);
    spadeGroup.add(spadeTop);
    
    // Spade middle parts (like rounded triangles)
    const spadeLeftGeometry = new THREE.ConeGeometry(0.4, 0.8, 16);
    const spadeLeft = new THREE.Mesh(spadeLeftGeometry, darkGoldMaterial);
    spadeLeft.position.set(-0.4, -0.2, 0);
    spadeLeft.rotation.z = -Math.PI * 0.15;
    spadeGroup.add(spadeLeft);
    
    const spadeRightGeometry = new THREE.ConeGeometry(0.4, 0.8, 16);
    const spadeRight = new THREE.Mesh(spadeRightGeometry, darkGoldMaterial);
    spadeRight.position.set(0.4, -0.2, 0);
    spadeRight.rotation.z = Math.PI * 0.15;
    spadeGroup.add(spadeRight);
    
    // Spade stem
    const spadeBaseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.9, 16);
    const spadeBase = new THREE.Mesh(spadeBaseGeometry, darkGoldMaterial);
    spadeBase.position.set(0, -0.9, 0);
    spadeGroup.add(spadeBase);
    
    // Small ball at the base of the stem
    const spadeBallGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const spadeBall = new THREE.Mesh(spadeBallGeometry, darkGoldMaterial);
    spadeBall.position.set(0, -1.3, 0);
    spadeGroup.add(spadeBall);
    
    // Scale and position the spade symbol on the front face of coin
    spadeGroup.scale.set(0.5, 0.5, 0.5);
    spadeGroup.position.set(0, 0, 1.1);
    scene.add(spadeGroup);
    
    // Create edge detail for more realistic coin
    const edgeGeometry = new THREE.TorusGeometry(2, 0.12, 16, 100);
    const edgeMesh = new THREE.Mesh(edgeGeometry, goldMaterial);
    edgeMesh.rotation.x = Math.PI / 2;
    scene.add(edgeMesh);
    
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
      coinMesh.rotation.y = Math.sin(time * 0.5) * 0.5;
      spadeGroup.rotation.y = Math.sin(time * 0.5) * 0.5;
      edgeMesh.rotation.y = Math.sin(time * 0.5) * 0.5;
      
      // Slight floating animation
      coinMesh.position.y = Math.sin(time) * 0.1;
      spadeGroup.position.y = Math.sin(time) * 0.1 + 0.1;
      edgeMesh.position.y = Math.sin(time) * 0.1;
      
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
