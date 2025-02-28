
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentModel, setCurrentModel] = useState("diamond");
  const [uploadedModel, setUploadedModel] = useState<File | null>(null);
  const [uploadedModelUrl, setUploadedModelUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Criar URL para o arquivo carregado
  useEffect(() => {
    if (uploadedModel) {
      const objectUrl = URL.createObjectURL(uploadedModel);
      setUploadedModelUrl(objectUrl);
      
      // Limpar a URL quando o componente for desmontado
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [uploadedModel]);

  // Carregar o modelo se a URL mudar
  useEffect(() => {
    if (uploadedModelUrl && currentModel === "uploaded") {
      setModelLoaded(false);
    }
  }, [uploadedModelUrl, currentModel]);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // Fix for newer Three.js versions
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    
    // Create orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Material para o modelo 3D
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95, // Glass-like transparency
      thickness: 0.5,
      envMapIntensity: 1.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      ior: 2.5, // High IOR for diamond-like refraction
      reflectivity: 1
    });
    
    // Inicialmente criamos um objeto vazio para representar nosso modelo
    let model = new THREE.Object3D();
    scene.add(model);
    
    // Podemos usar diferentes geometrias ou carregar modelos 3D externos
    
    // OPÇÃO 1: Usar geometria básica do Three.js (exemplo com diamante)
    const createDiamondGeometry = () => {
      // Diamond geometry usando polyhedron
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
      const diamond = new THREE.Mesh(geometry, material);
      
      // Limpar o modelo atual e adicionar o novo
      scene.remove(model);
      model = diamond;
      scene.add(model);
      setModelLoaded(true);
    };
    
    // OPÇÃO 2: Usar uma esfera
    const createSphereModel = () => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const sphere = new THREE.Mesh(geometry, material);
      
      // Limpar o modelo atual e adicionar o novo
      scene.remove(model);
      model = sphere;
      scene.add(model);
      setModelLoaded(true);
    };
    
    // OPÇÃO 3: Usar um torus (anel)
    const createTorusModel = () => {
      const geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
      const torus = new THREE.Mesh(geometry, material);
      
      // Limpar o modelo atual e adicionar o novo
      scene.remove(model);
      model = torus;
      scene.add(model);
      setModelLoaded(true);
    };
    
    // OPÇÃO 4: Carregar um modelo GLTF externo
    const loadGLTFModel = (url: string) => {
      console.log("Carregando modelo:", url);
      
      const loader = new GLTFLoader();
      loader.load(
        // URL do modelo
        url,
        // Callback chamado quando o modelo é carregado
        (gltf) => {
          console.log("Modelo carregado com sucesso:", gltf);
          
          // Limpar o modelo atual
          scene.remove(model);
          
          // Ajustar o tamanho e materiais do modelo carregado
          const newModel = gltf.scene;
          
          // Ajuste a escala conforme necessário
          newModel.scale.set(1, 1, 1);
          
          // Opcionalmente, aplicar material a todos os objetos do modelo
          newModel.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.material = material;
            }
          });
          
          // Definir como o modelo atual
          model = newModel;
          scene.add(model);
          setModelLoaded(true);
        },
        // Callback de progresso do carregamento
        (xhr) => {
          console.log("Progresso:", (xhr.loaded / xhr.total * 100) + "% carregado");
        },
        // Callback de erro
        (error) => {
          console.error("Erro ao carregar modelo:", error);
        }
      );
    };
    
    // Carregar modelo baseado no estado atual
    switch (currentModel) {
      case "diamond":
        createDiamondGeometry();
        break;
      case "sphere":
        createSphereModel();
        break;
      case "torus":
        createTorusModel();
        break;
      case "gltf":
        // Substitua pelo caminho do seu modelo na pasta public
        loadGLTFModel('/seu-modelo.gltf');
        break;
      case "uploaded":
        // Usar o modelo carregado pelo usuário
        if (uploadedModelUrl) {
          loadGLTFModel(uploadedModelUrl);
        } else {
          // Fallback para o diamante se não houver modelo carregado
          createDiamondGeometry();
        }
        break;
      default:
        createDiamondGeometry();
    }
    
    // Load HDR environment map
    const rgbeLoader = new RGBELoader();
    rgbeLoader.setDataType(THREE.FloatType);
    
    // Using a public HDR file - replace with your desired HDR file
    rgbeLoader.load('/environment.hdr', (texture) => {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    });
    
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
      light.position.set(position[0], position[1], position[2]);
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
      
      if (model) {
        model.rotation.y += 0.005;
        model.rotation.x += 0.0025;
      }
      
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
      scene.clear();
      renderer.dispose();
    };
  }, [currentModel, uploadedModelUrl]);
  
  // Funções para mudar o modelo
  const handleChangeModel = (modelType: string) => {
    console.log("Mudando para modelo:", modelType);
    setModelLoaded(false); // Mostrar indicador de carregamento
    setCurrentModel(modelType);
  };
  
  // Função para tratar o upload de arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Arquivo selecionado:", file);
      
      // Verificar se o arquivo é um GLTF ou GLB
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        setUploadedModel(file);
        handleChangeModel('uploaded');
      } else {
        alert('Por favor, selecione um arquivo GLTF ou GLB válido.');
      }
    }
  };
  
  // Função para abrir o seletor de arquivo
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
        <div className="animate-fade-in">
          <p className="text-sm uppercase tracking-wider mb-2 opacity-80">Experience brilliance</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">Reflection</h1>
          <p className="max-w-md text-center text-lg opacity-80">
            A stunning 3D representation with perfect clarity and exceptional brilliance
          </p>
          
          {/* Controles para escolher o modelo */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button 
              className={`px-4 py-2 rounded-md ${currentModel === 'diamond' ? 'bg-white text-black' : 'bg-black/30 text-white border border-white/30'}`}
              onClick={() => handleChangeModel('diamond')}
            >
              Diamante
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${currentModel === 'sphere' ? 'bg-white text-black' : 'bg-black/30 text-white border border-white/30'}`}
              onClick={() => handleChangeModel('sphere')}
            >
              Esfera
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${currentModel === 'torus' ? 'bg-white text-black' : 'bg-black/30 text-white border border-white/30'}`}
              onClick={() => handleChangeModel('torus')}
            >
              Anel
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${currentModel === 'gltf' ? 'bg-white text-black' : 'bg-black/30 text-white border border-white/30'}`}
              onClick={() => handleChangeModel('gltf')}
            >
              Modelo GLTF
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${currentModel === 'uploaded' ? 'bg-white text-black' : 'bg-black/30 text-white border border-white/30'}`}
              onClick={openFileSelector}
            >
              Carregar Modelo
            </button>
            
            {/* Input para upload de arquivo (escondido) */}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept=".gltf,.glb"
              onChange={handleFileUpload}
            />
          </div>
          
          {/* Exibir o nome do arquivo carregado, se houver */}
          {uploadedModel && (
            <div className="mt-3 text-center">
              <p className="text-sm opacity-80">
                Modelo carregado: {uploadedModel.name}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading indicator */}
      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="text-white text-xl">Carregando modelo...</div>
        </div>
      )}
      
      {/* Diamond canvas container */}
      <div ref={mountRef} className="absolute inset-0 z-10" />
    </div>
  );
};

export default Index;
