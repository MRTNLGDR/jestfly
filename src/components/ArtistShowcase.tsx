
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import * as BABYLON from '@babylonjs/core';

const ArtistShowcase: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);

  const artists = [
    {
      name: "NERO BLVCK",
      role: "DJ | Producer",
      image: "/assets/imagem1.jpg", // Replace with actual artist image
      description: "Pioneering the future of electronic music with cutting-edge sound design and immersive performances."
    },
    {
      name: "CRYSTAL WAVE",
      role: "Live Act | Visual Artist",
      image: "/assets/imagem1.jpg", // Replace with actual artist image
      description: "Blending audiovisual experiences that transport audiences to otherworldly dimensions."
    },
    {
      name: "PULSE SYNDICATE",
      role: "DJ Collective",
      image: "/assets/imagem1.jpg", // Replace with actual artist image
      description: "A collective of visionary DJs pushing the boundaries of dance music through collaborative innovation."
    }
  ];

  // Setup 3D background elements
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Babylon.js
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // Create camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 20;

    // Add ambient light
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.4;

    // Add point lights
    const purpleLight = new BABYLON.PointLight("purpleLight", new BABYLON.Vector3(-5, 3, 2), scene);
    purpleLight.diffuse = BABYLON.Color3.FromHexString("#9b87f5");
    purpleLight.intensity = 2;

    const blueLight = new BABYLON.PointLight("blueLight", new BABYLON.Vector3(5, -2, -3), scene);
    blueLight.diffuse = BABYLON.Color3.FromHexString("#4ade80");
    blueLight.intensity = 2;

    // Create floating particles/shapes
    for (let i = 0; i < 20; i++) {
      // Create small floating crystal shapes
      const type = Math.floor(Math.random() * 3);
      let shape;
      
      if (type === 0) {
        shape = BABYLON.MeshBuilder.CreatePolyhedron("crystal" + i, { type: 1, size: 0.5 * Math.random() + 0.3 }, scene);
      } else if (type === 1) {
        shape = BABYLON.MeshBuilder.CreateTorusKnot("knot" + i, { radius: 0.3, tube: 0.1, radialSegments: 32 }, scene);
      } else {
        shape = BABYLON.MeshBuilder.CreateSphere("sphere" + i, { diameter: 0.4 }, scene);
      }
      
      // Add material to shapes
      const material = new BABYLON.PBRMaterial("material" + i, scene);
      material.albedoColor = BABYLON.Color3.FromHexString(["#9b87f5", "#4ade80", "#E5DEFF"][Math.floor(Math.random() * 3)]);
      material.metallic = 0.8;
      material.roughness = 0.2;
      material.alpha = 0.7;
      
      if (Math.random() > 0.5) {
        material.emissiveColor = material.albedoColor.scale(0.5);
        material.emissiveIntensity = 0.5;
      }
      
      shape.material = material;
      
      // Random position
      shape.position = new BABYLON.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      // Animation
      scene.registerBeforeRender(() => {
        const time = performance.now() * 0.001;
        shape.rotation.x = time * 0.1 * (i % 3);
        shape.rotation.y = time * 0.2 * ((i + 1) % 3);
        
        // Floating motion
        shape.position.y += Math.sin(time + i) * 0.002;
        shape.position.x += Math.cos(time * 0.7 + i) * 0.001;
      });
    }

    // Run render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize handler
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      scene.dispose();
    };
  }, []);

  return (
    <section className="relative w-full py-20 overflow-hidden bg-black">
      {/* 3D Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient-primary">MEET OUR</span> ARTISTS
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            The visionary talents redefining electronic music and pushing the boundaries of artistic expression.
          </p>
        </div>

        {/* Artist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-lg group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Background Image */}
              <div className="aspect-[2/3] w-full overflow-hidden">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Glassmorphism Overlay */}
              <motion.div 
                className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300"
                animate={{
                  backdropFilter: activeCard === index ? "blur(0px)" : "blur(8px)",
                  backgroundColor: activeCard === index ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* 3D floating elements in the card */}
                <div className="absolute w-16 h-16 right-4 top-4 opacity-50 rotate-45 rounded-lg bg-gradient-to-tr from-purple-500/30 to-transparent"></div>
                <div className="absolute w-24 h-24 -left-6 bottom-10 opacity-30 rounded-full bg-gradient-to-tr from-cyan-500/30 to-transparent"></div>
                
                {/* Artist Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{artist.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{artist.role}</p>
                  
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: activeCard === index ? 1 : 0,
                      height: activeCard === index ? "auto" : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mb-4">{artist.description}</p>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm transition-colors">
                      DISCOVER MORE
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistShowcase;
