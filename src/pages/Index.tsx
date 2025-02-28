
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { ModelParameters, defaultModelParams } from "@/types/model";

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Usar a preferência de modelo do localStorage ou o padrão (diamond)
  const [currentModel, setCurrentModel] = useState(() => {
    const savedModel = localStorage.getItem("preferredModel");
    return savedModel || "diamond";
  });
  
  // Carregar parâmetros do modelo do localStorage
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : defaultModelParams;
  });

  useEffect(() => {
    if (!mountRef.current) return;
    
    setLoadingError(null);
    
    console.log("Inicializando cena 3D");
    console.log("Modelo atual:", currentModel);
    console.log("Parâmetros:", modelParams);

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // Aumentado para mostrar mais do modelo
    
    // Renderer setup com alpha para transparência
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = modelParams.lightIntensity;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    
    // Create orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true; // Habilitar rotação automática
    controls.autoRotateSpeed = 1.5; // Velocidade de rotação
    
    // Material configurável baseado nos parâmetros
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(modelParams.color),
      metalness: modelParams.metalness,
      roughness: modelParams.roughness,
      transmission: modelParams.transmission,
      thickness: modelParams.thickness,
      envMapIntensity: modelParams.envMapIntensity,
      clearcoat: modelParams.clearcoat,
      clearcoatRoughness: modelParams.clearcoatRoughness,
      ior: modelParams.ior,
      reflectivity: modelParams.reflectivity,
      iridescence: modelParams.iridescence,
      iridescenceIOR: modelParams.iridescenceIOR
    });
    
    // Inicialmente criamos um objeto vazio para representar nosso modelo
    let model = new THREE.Object3D();
    scene.add(model);
    
    // Função para criar o diamante
    const createDiamondGeometry = () => {
      console.log("Criando modelo de diamante");
      
      try {
        // Diamond geometry mais detalhada
        const vertices = [
          // Top point
          0, 2, 0,
          // Middle points - create a circular pattern
          ...Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.cos(angle) * 1.0;
            const z = Math.sin(angle) * 1.0;
            return [x, 0, z];
          }).flat(),
          // Bottom point
          0, -2, 0,
        ];
        
        const indices = [];
        // Top faces
        for (let i = 1; i < 13; i++) {
          indices.push(0, i, i === 12 ? 1 : i + 1);
        }
        // Middle faces
        for (let i = 1; i < 13; i++) {
          indices.push(i, 13, i === 12 ? 1 : i + 1);
        }
        
        const geometry = new THREE.PolyhedronGeometry(vertices, indices, 2.5, 5);
        const diamond = new THREE.Mesh(geometry, material);
        diamond.scale.set(1.5, 1.5, 1.5); // Maior para cobrir mais da tela
        
        // Limpar o modelo atual e adicionar o novo
        scene.remove(model);
        model = diamond;
        scene.add(model);
        setModelLoaded(true);
        console.log("Diamante criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar diamante:", error);
        setLoadingError("Erro ao criar o modelo de diamante");
      }
    };
    
    // Função para criar esfera
    const createSphereModel = () => {
      console.log("Criando modelo de esfera");
      
      try {
        const geometry = new THREE.SphereGeometry(2.5, 64, 64); // Maior e mais detalhada
        const sphere = new THREE.Mesh(geometry, material);
        
        // Limpar o modelo atual e adicionar o novo
        scene.remove(model);
        model = sphere;
        scene.add(model);
        setModelLoaded(true);
        console.log("Esfera criada com sucesso");
      } catch (error) {
        console.error("Erro ao criar esfera:", error);
        setLoadingError("Erro ao criar o modelo de esfera");
      }
    };
    
    // Função para criar torus
    const createTorusModel = () => {
      console.log("Criando modelo de torus");
      
      try {
        const geometry = new THREE.TorusGeometry(2, 0.7, 32, 128); // Maior e mais detalhado
        const torus = new THREE.Mesh(geometry, material);
        
        // Limpar o modelo atual e adicionar o novo
        scene.remove(model);
        model = torus;
        scene.add(model);
        setModelLoaded(true);
        console.log("Torus criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar torus:", error);
        setLoadingError("Erro ao criar o modelo de anel");
      }
    };
    
    // Função para carregar GLTF
    const loadGLTFModel = (url: string) => {
      console.log("Carregando modelo GLTF:", url);
      
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          console.log("Modelo GLTF carregado com sucesso:", gltf);
          
          // Limpar o modelo atual
          scene.remove(model);
          
          // Ajustar o tamanho e materiais do modelo carregado
          const newModel = gltf.scene;
          
          // Aumentar a escala para cobrir mais da tela
          newModel.scale.set(2.0, 2.0, 2.0);
          
          // Aplicar material cristalino a todos os objetos
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
        (xhr) => {
          console.log("Progresso:", (xhr.loaded / xhr.total * 100) + "% carregado");
        },
        (error) => {
          console.error("Erro ao carregar modelo GLTF:", error);
          setLoadingError("Erro ao carregar o modelo 3D");
        }
      );
    };
    
    // Função para criar um ambiente básico quando o HDR falhar
    const createBasicEnvironment = () => {
      console.log("Criando ambiente básico");
      // Criar um ambiente simples como fallback
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      cubeRenderTarget.texture.type = THREE.HalfFloatType;
      
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileCubemapShader();
      
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x2266cc);
      
      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      cubeCamera.update(renderer, envScene);
      
      const envMap = pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
      scene.environment = envMap;
      pmremGenerator.dispose();
      
      console.log("Ambiente básico criado");
    };
    
    // Carregar modelo baseado no estado atual (vindo do Admin)
    try {
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
          // Usar fallback se o modelo GLTF não puder ser carregado
          try {
            loadGLTFModel('/seu-modelo.gltf');
          } catch (error) {
            console.error("Erro ao carregar modelo GLTF, usando diamante como fallback:", error);
            createDiamondGeometry();
          }
          break;
        default:
          createDiamondGeometry();
      }
    } catch (error) {
      console.error("Erro ao carregar modelo:", error);
      setLoadingError("Erro ao carregar o modelo 3D");
      // Tentar criar um modelo básico como fallback
      createDiamondGeometry();
    }
    
    // Load HDR environment map para reflexões realistas
    const rgbeLoader = new RGBELoader();
    rgbeLoader.setDataType(THREE.FloatType);
    
    // Tentar diferentes caminhos de ambiente
    const tryLoadEnvMap = () => {
      // Lista de possíveis caminhos para o HDR
      const paths = [
        '/environment.hdr',
        '/public/environment.hdr',
        '/envmap/environment.hdr',
        '/hdr/environment.hdr'
      ];
      
      let loaded = false;
      
      // Tentar cada caminho
      const tryNextPath = (index = 0) => {
        if (index >= paths.length) {
          console.warn("Não foi possível carregar nenhum mapa de ambiente, usando ambiente básico");
          createBasicEnvironment();
          return;
        }
        
        console.log(`Tentando carregar ambiente HDR de: ${paths[index]}`);
        
        rgbeLoader.load(
          paths[index],
          (texture) => {
            if (loaded) return; // Evitar carregar múltiplos ambientes
            loaded = true;
            
            console.log(`Ambiente HDR carregado com sucesso de: ${paths[index]}`);
            
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
          },
          undefined,
          () => {
            console.warn(`Falha ao carregar ambiente HDR de: ${paths[index]}`);
            // Tentar o próximo caminho
            tryNextPath(index + 1);
          }
        );
      };
      
      // Iniciar a tentativa de carregamento
      tryNextPath();
    };
    
    tryLoadEnvMap();
    
    // Iluminação básica que sempre será adicionada
    // Iluminação aprimorada para destacar reflexões e refrações
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, modelParams.lightIntensity);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Luzes adicionais para reflexos especulares
    const colors = [0xffffff, 0xffccd5, 0xd5ffff, 0xffffcc];
    const positions = [
      [3, 2, 2],
      [-3, -2, 2],
      [0, -3, -3],
      [3, 0, -2]
    ];
    
    positions.forEach((position, i) => {
      const light = new THREE.PointLight(colors[i], modelParams.lightIntensity * 0.8, 15);
      light.position.set(position[0], position[1], position[2]);
      scene.add(light);
    });
    
    // Resize handler
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
        // A rotação agora é feita pelos OrbitControls (autoRotate)
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
      
      scene.clear();
      renderer.dispose();
    };
  }, [currentModel, modelParams]);
  
  // Verificar alterações nos parâmetros salvos no localStorage
  useEffect(() => {
    const checkForUpdates = () => {
      const savedParams = localStorage.getItem("modelParameters");
      if (savedParams) {
        const newParams = JSON.parse(savedParams);
        // Comparar com os parâmetros atuais para ver se precisa atualizar
        if (JSON.stringify(newParams) !== JSON.stringify(modelParams)) {
          setModelParams(newParams);
        }
      }
      
      const savedModel = localStorage.getItem("preferredModel");
      if (savedModel && savedModel !== currentModel) {
        setCurrentModel(savedModel);
      }
    };
    
    // Verificar a cada segundo por mudanças nos parâmetros (para quando admin estiver aberto em outra aba)
    const interval = setInterval(checkForUpdates, 1000);
    
    // Adicionar event listener para o evento storage
    window.addEventListener('storage', checkForUpdates);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkForUpdates);
    };
  }, [modelParams, currentModel]);
  
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Admin Link */}
      <div className="absolute top-4 right-4 z-30">
        <Link 
          to="/admin" 
          className="flex items-center gap-2 px-3 py-2 bg-black/30 hover:bg-black/50 rounded-md text-white transition-colors border border-white/10"
        >
          <Settings size={16} />
          Admin
        </Link>
      </div>

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
        <div className="animate-fade-in text-center">
          <p className="text-sm uppercase tracking-wider mb-2 opacity-80">Experience brilliance</p>
          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-300">JESTFLY</h1>
          <p className="max-w-md text-center text-lg opacity-80 mx-auto">
            A stunning 3D representation with perfect clarity and exceptional brilliance. 
            The crystal refracts and reflects light, creating a mesmerizing display.
          </p>
        </div>
      </div>
      
      {/* Loading indicator */}
      {!modelLoaded && !loadingError && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="text-white text-xl">Carregando modelo...</div>
        </div>
      )}
      
      {/* Error message */}
      {loadingError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/70">
          <div className="text-red-400 text-2xl mb-4">Erro de carregamento</div>
          <div className="text-white text-xl mb-6">{loadingError}</div>
          <Link 
            to="/admin" 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors"
          >
            Ir para o painel de Admin
          </Link>
        </div>
      )}
      
      {/* 3D model container */}
      <div ref={mountRef} className="absolute inset-0 z-10" />
    </div>
  );
};

export default Index;
