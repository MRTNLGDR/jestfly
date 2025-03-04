
import { useEffect, useRef } from "react";

const FloatingCrystal: React.FC = () => {
  const crystalRef = useRef<HTMLDivElement>(null);
  
  // Configurar o cristal flutuante na frente
  useEffect(() => {
    if (!crystalRef.current) return;
    
    const crystal = crystalRef.current;
    
    // Configurar animação do cristal
    const animate = () => {
      crystal.style.transform = `rotate3d(1, 1, 1, ${Date.now() / 5000}rad) rotate(${Date.now() / 3000}rad)`;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div 
      ref={crystalRef}
      className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div 
        className="w-[600px] h-[600px] relative"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          boxShadow: "0 0 80px rgba(255,255,255,0.15), inset 0 0 80px rgba(255,255,255,0.15)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderRadius: "50%",
          opacity: 0.8,
          transform: "scale(0.8)",
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
            mixBlendMode: "overlay",
          }}
        ></div>
      </div>
    </div>
  );
};

export default FloatingCrystal;
