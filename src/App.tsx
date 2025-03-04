import './App.css';
import { defaultModelParams } from './types/model';

function App() {
  // Crystal parameters with customized values for enhanced futuristic effect
  const crystalParams = {
    ...defaultModelParams,
    color: "#ffffff", // Pure white base color for better refraction
    metalness: 0.2, // Slight metalness for better reflections
    roughness: 0.01, // Ultra smooth surface for crisp reflections
    transmission: 0.98, // Near perfect transmission for glass effect
    thickness: 0.8, // Increased thickness for more internal refraction
    envMapIntensity: 5.0, // Boosted reflections to showcase neon environment
    clearcoat: 1.0, // Maximum clearcoat for extra glossiness
    clearcoatRoughness: 0.0, // Perfect clearcoat smoothness
    ior: 2.5, // Higher index of refraction for diamond-like effect
    iridescence: 1.0, // Strong iridescence for color shifts
    iridescenceIOR: 2.0, // Enhanced iridescence refraction
    transparent: true,
    opacity: 0.8, // Reduced opacity for better visual effect
    reflectivity: 1.0, // Maximum reflectivity
    emissiveIntensity: 0.08, // Slight emission for added glow
    emissiveColor: "#8B5CF6", // Subtle purple emission color
    lightIntensity: 5.0 // Brighter lights to enhance the model
  };
  
  return (
    <div className="app">
      {/* O App.tsx agora serve apenas como um componente wrapper e não contém mais a lógica de roteamento */}
    </div>
  );
}

export default App;
