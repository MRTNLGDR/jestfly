
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
    
    // Create poker chip geometry
    const chipGeometry = new THREE.CylinderGeometry(2, 2, 0.4, 32);
    
    // Create red material for the main chip
    const chipMaterial = new THREE.MeshStandardMaterial({
      color: 0xCC0000, // Red color for casino chip
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1.2
    });
    
    // Create white material for chip edge and patterns
    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, 
      metalness: 0.5,
      roughness: 0.3
    });
    
    // Create poker chip mesh
    const chipMesh = new THREE.Mesh(chipGeometry, chipMaterial);
    scene.add(chipMesh);
    
    // Create edge for the chip
    const edgeGeometry = new THREE.TorusGeometry(2, 0.22, 16, 100);
    const edgeMesh = new THREE.Mesh(edgeGeometry, whiteMaterial);
    edgeMesh.rotation.x = Math.PI / 2;
    scene.add(edgeMesh);
    
    // Create spade symbol for the center of the chip
    const spadeGroup = new THREE.Group();
    
    // Spade top (heart upside-down)
    const spadeTopGeometry = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const spadeTop = new THREE.Mesh(spadeTopGeometry, whiteMaterial);
    spadeTop.scale.set(1, 1.3, 0.8);
    spadeTop.position.set(0, 0.2, 0);
    spadeGroup.add(spadeTop);
    
    // Spade middle parts (like rounded triangles)
    const spadeLeftGeometry = new THREE.ConeGeometry(0.4, 0.8, 16);
    const spadeLeft = new THREE.Mesh(spadeLeftGeometry, whiteMaterial);
    spadeLeft.position.set(-0.4, -0.2, 0);
    spadeLeft.rotation.z = -Math.PI * 0.15;
    spadeGroup.add(spadeLeft);
    
    const spadeRightGeometry = new THREE.ConeGeometry(0.4, 0.8, 16);
    const spadeRight = new THREE.Mesh(spadeRightGeometry, whiteMaterial);
    spadeRight.position.set(0.4, -0.2, 0);
    spadeRight.rotation.z = Math.PI * 0.15;
    spadeGroup.add(spadeRight);
    
    // Spade stem
    const spadeBaseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.9, 16);
    const spadeBase = new THREE.Mesh(spadeBaseGeometry, whiteMaterial);
    spadeBase.position.set(0, -0.9, 0);
    spadeGroup.add(spadeBase);
    
    // Small ball at the base of the stem
    const spadeBallGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const spadeBall = new THREE.Mesh(spadeBallGeometry, whiteMaterial);
    spadeBall.position.set(0, -1.3, 0);
    spadeGroup.add(spadeBall);
    
    // Scale and position the spade symbol on the front face of chip
    spadeGroup.scale.set(0.5, 0.5, 0.5);
    spadeGroup.position.set(0, 0, 1.1);
    scene.add(spadeGroup);
    
    // Create pattern on the edge of the chip (white dots)
    const createDots = () => {
      const dotGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const dot = new THREE.Mesh(dotGeometry, whiteMaterial);
        
        const x = Math.sin(angle) * 2;
        const z = Math.cos(angle) * 2;
        
        dot.position.set(x, 0, z);
        scene.add(dot);
      }
    };
    
    createDots();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Rotate chip
      chipMesh.rotation.y = Math.sin(time * 0.5) * 0.5;
      spadeGroup.rotation.y = Math.sin(time * 0.5) * 0.5;
      edgeMesh.rotation.y = Math.sin(time * 0.5) * 0.5 + Math.PI / 2;
      
      // Slight floating animation
      chipMesh.position.y = Math.sin(time) * 0.1;
      spadeGroup.position.y = Math.sin(time) * 0.1 + 0.2;
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
