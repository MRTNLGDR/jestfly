
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
    scene.background = new THREE.Color(0x000000); // Fundo preto sólido
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6; // Aumentado para mostrar mais do modelo
    
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
    controls.autoRotateSpeed = 0.8; // Velocidade de rotação mais lenta
    controls.enableZoom = false; // Desativar zoom para manter a composição
    
    // Material configurável baseado nos parâmetros - mais transparente e reflexivo
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(modelParams.color),
      metalness: modelParams.metalness,
      roughness: 0.005, // Mais liso para maior reflexão
      transmission: 0.95, // Mais transparente
      thickness: modelParams.thickness,
      envMapIntensity: 3.5, // Aumentar intensidade da reflexão
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      ior: 2.75, // Índice de refração alto para maior distorção
      reflectivity: 1.0,
      iridescence: 0.5, // Aumentar efeito iridescente
      iridescenceIOR: 1.3
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
          ...Array.from({ length: 18 }, (_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const x = Math.cos(angle) * 1.0;
            const z = Math.sin(angle) * 1.0;
            return [x, 0, z];
          }).flat(),
          // Bottom point
          0, -2, 0,
        ];
        
        const indices = [];
        // Top faces
        for (let i = 1; i < 19; i++) {
          indices.push(0, i, i === 18 ? 1 : i + 1);
        }
        // Middle faces
        for (let i = 1; i < 19; i++) {
          indices.push(i, 19, i === 18 ? 1 : i + 1);
        }
        
        const geometry = new THREE.PolyhedronGeometry(vertices, indices, 2.5, 6);
        const diamond = new THREE.Mesh(geometry, material);
        diamond.scale.set(1.8, 1.8, 1.8); // Maior para cobrir mais da tela
        
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
    
    // Função para criar efeito de cristal distorcido
    const createCrystalGeometry = () => {
      console.log("Criando modelo de cristal distorcido");
      
      try {
        // Criar geometria base
        const geometry = new THREE.IcosahedronGeometry(2, 3);
        
        // Distorcer os vértices para dar um efeito de cristal irregular
        const positionAttribute = geometry.getAttribute('position');
        const vertex = new THREE.Vector3();
        
        for (let i = 0; i < positionAttribute.count; i++) {
          vertex.fromBufferAttribute(positionAttribute, i);
          
          // Aplicar distorção baseada em noise simplex (simulado com Math.sin)
          const distortionFactor = 0.2;
          const noise = Math.sin(vertex.x * 5) * Math.sin(vertex.y * 3) * Math.sin(vertex.z * 7);
          
          vertex.x += noise * distortionFactor;
          vertex.y += noise * distortionFactor;
          vertex.z += noise * distortionFactor;
          
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        geometry.computeVertexNormals(); // Recalcular normais após distorção
        
        const crystal = new THREE.Mesh(geometry, material);
        crystal.scale.set(1.2, 1.2, 1.2);
        
        // Limpar o modelo atual e adicionar o novo
        scene.remove(model);
        model = crystal;
        scene.add(model);
        setModelLoaded(true);
        console.log("Cristal distorcido criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar cristal:", error);
        setLoadingError("Erro ao criar o modelo de cristal");
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
      
      // Criar uma cena de ambiente com gradiente
      const envScene = new THREE.Scene();
      
      // Gradiente vertical para o fundo
      const topColor = new THREE.Color(0x000000); // Preto no topo
      const bottomColor = new THREE.Color(0x330011); // Vermelho escuro embaixo
      
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, topColor.getStyle());
        gradient.addColorStop(1, bottomColor.getStyle());
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 256);
        
        const gradientTexture = new THREE.CanvasTexture(canvas);
        gradientTexture.colorSpace = THREE.SRGBColorSpace;
        
        // Adicionar linhas diagonais para simular refletividade do modelo
        const diagonalCanvas = document.createElement('canvas');
        diagonalCanvas.width = 512;
        diagonalCanvas.height = 512;
        const diagContext = diagonalCanvas.getContext('2d');
        if (diagContext) {
          diagContext.fillStyle = '#000000';
          diagContext.fillRect(0, 0, 512, 512);
          
          // Desenhar linhas diagonais em vermelho
          diagContext.strokeStyle = '#FF0033';
          diagContext.lineWidth = 4;
          for (let i = -512; i < 512; i += 60) {
            diagContext.beginPath();
            diagContext.moveTo(i, 0);
            diagContext.lineTo(i + 512, 512);
            diagContext.stroke();
          }
          
          const linesTexture = new THREE.CanvasTexture(diagonalCanvas);
          linesTexture.wrapS = THREE.RepeatWrapping;
          linesTexture.wrapT = THREE.RepeatWrapping;
          linesTexture.repeat.set(1, 1);
          
          // Combinar os dois fundos
          const bgMaterial = new THREE.MeshBasicMaterial({
            map: linesTexture,
            side: THREE.BackSide
          });
          
          const bgSphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 32, 32),
            bgMaterial
          );
          
          envScene.add(bgSphere);
        }
      }
      
      // Capturar ambiente
      cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      cubeCamera.update(renderer, envScene);
      
      // Criar mapa de ambiente a partir da captura
      const envMap = pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
      scene.environment = envMap;
      pmremGenerator.dispose();
      
      console.log("Ambiente básico criado");
    };
    
    // Vamos usar o modelo de cristal distorcido por padrão para a estética desejada
    createCrystalGeometry();
    
    // Adicionar evento para detectar cliques ou toques no cristal
    // Isso fará o cristal girar mais rápido temporariamente
    let touchTimeout: number | null = null;
    const handleTouch = () => {
      controls.autoRotateSpeed = 5.0; // Girar mais rápido ao tocar
      
      // Resetar velocidade após um tempo
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = window.setTimeout(() => {
        controls.autoRotateSpeed = 0.8; // Voltar à velocidade normal
      }, 2000);
    };
    
    window.addEventListener('click', handleTouch);
    window.addEventListener('touchstart', handleTouch);
    
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
    
    // Tentar carregar o mapa de ambiente ou usar o fallback
    tryLoadEnvMap();
    
    // Variável para o cubeCamera (adicionado acima)
    let cubeCamera: THREE.CubeCamera;
    
    // Criar linha diagonal (semelhante ao visual da referência)
    const createDiagonalLine = () => {
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
      });
      
      const points = [];
      points.push(new THREE.Vector3(-20, 15, -15));
      points.push(new THREE.Vector3(20, -10, -15));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    };
    
    createDiagonalLine();
    
    // Iluminação aprimorada para destacar reflexões e refrações
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Luz principal direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Luzes coloridas para criar efeitos interessantes
    const colors = [0xff3366, 0xffccd5, 0xd5ffff, 0xffffcc];
    const positions = [
      [3, 2, 2],
      [-3, -2, 2],
      [0, -3, -3],
      [3, 0, -2]
    ];
    
    positions.forEach((position, i) => {
      const light = new THREE.PointLight(colors[i], 2.0, 15);
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
        // Pulsar levemente o modelo
        const pulseFactor = Math.sin(Date.now() * 0.001) * 0.03 + 1;
        model.scale.set(pulseFactor * 1.2, pulseFactor * 1.2, pulseFactor * 1.2);
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      
      if (touchTimeout) clearTimeout(touchTimeout);
      
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
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Admin Link */}
      <div className="absolute top-4 right-4 z-30">
        <Link 
          to="/admin" 
          className="flex items-center gap-2 px-3 py-2 bg-black/70 hover:bg-black/90 rounded-md text-white transition-colors border border-white/10"
        >
          <Settings size={16} />
          Admin
        </Link>
      </div>

      {/* Logo/Title overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <h1 className="text-9xl md:text-[12rem] font-bold tracking-tighter text-red-600 leading-none opacity-90">
          MKSHA
        </h1>
      </div>

      {/* Content overlay */}
      <div className="absolute left-16 bottom-32 z-20 max-w-xs text-left text-white">
        <div className="animate-fade-in space-y-2">
          <p className="text-sm uppercase tracking-widest opacity-80">
            It was the year
          </p>
          <p className="text-sm uppercase tracking-widest opacity-80">
            2076. The substance
          </p>
          <p className="text-sm uppercase tracking-widest opacity-80">
            had arrived.
          </p>
        </div>
      </div>
      
      {/* Loading indicator */}
      {!modelLoaded && !loadingError && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/90">
          <div className="text-white text-xl">Carregando modelo...</div>
        </div>
      )}
      
      {/* Error message */}
      {loadingError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90">
          <div className="text-red-500 text-2xl mb-4">Erro de carregamento</div>
          <div className="text-white text-xl mb-6">{loadingError}</div>
          <Link 
            to="/admin" 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors"
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
