
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Environment map for realistic reflections
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMap = cubeTextureLoader.load([
      '/envmap/px.jpg',
      '/envmap/nx.jpg',
      '/envmap/py.jpg',
      '/envmap/ny.jpg',
      '/envmap/pz.jpg',
      '/envmap/nz.jpg'
    ]);
    scene.environment = environmentMap;
    
    // Diamond geometry
    // Using a custom polyhedron for better diamond shape
    const vertices = [
      // Top point
      0, 1, 0,
      // Middle points - create a circular pattern
      ...Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.5;
        const z = Math.sin(angle) * 0.5;
        return [x, 0, z];
      }).flat(),
      // Bottom point
      0, -1, 0,
    ];
    
    const indices = [];
    // Top faces
    for (let i = 1; i < 9; i++) {
      indices.push(0, i, i === 8 ? 1 : i + 1);
    }
    // Middle faces
    for (let i = 1; i < 9; i++) {
      indices.push(i, 9, i === 8 ? 1 : i + 1);
    }
    
    const geometry = new THREE.PolyhedronGeometry(vertices, indices, 1, 4);
    
    // Diamond material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95, // Glass-like transparency
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      ior: 2.5, // High IOR for diamond-like refraction
      reflectivity: 1
    });
    
    // Create diamond mesh
    const diamond = new THREE.Mesh(geometry, material);
    scene.add(diamond);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Add point lights in different positions for sparkles
    const colors = [0xffffff, 0xfff0dd, 0xddeeff];
    const positions = [
      [2, 1, 1],
      [-2, -1, 1],
      [0, -2, -2]
    ];
    
    positions.forEach((position, i) => {
      const light = new THREE.PointLight(colors[i], 1, 10);
      light.position.set(...position);
      scene.add(light);
    });
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      diamond.rotation.y += 0.005;
      diamond.rotation.x += 0.0025;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Diamond canvas container */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="animate-fade-in">
          <p className="text-sm uppercase tracking-wider mb-2 opacity-80">Experience brilliance</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">Reflection</h1>
          <p className="max-w-md text-center text-lg opacity-80">
            A stunning 3D representation with perfect clarity and exceptional brilliance
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
