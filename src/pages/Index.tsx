import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Link } from "react-router-dom";
import { Settings, Loader2 } from "lucide-react";
import { ModelParameters, defaultModelParams } from "@/types/modelParameters";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { ModelType, SavedModel } from "@/types/model";

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sketchfabContainerRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const frontCrystalRef = useRef<HTMLDivElement>(null);
  
  // Carregar o título e subtítulo do localStorage
  const [titleText, setTitleText] = useState(() => {
    return localStorage.getItem("siteTitle") || "MKSHA";
  });
  
  const [subtitleText, setSubtitleText] = useState(() => {
    return localStorage.getItem("siteSubtitle") || "It was the year 2076. The substance had arrived.";
  });
  
  // Usar a preferência de modelo do localStorage ou o padrão (diamond)
  const [currentModel, setCurrentModel] = useState(() => {
    const savedModel = localStorage.getItem("preferredModel");
    return savedModel || "diamond";
  });
  
  // Sketchfab URL para embedar
  const [sketchfabUrl, setSketchfabUrl] = useState<string | null>(null);
  const [sketchfabModelData, setSketchfabModelData] = useState<SavedModel | null>(null);
  
  // Carregar parâmetros do modelo do localStorage
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : defaultModelParams;
  });

  // Configurar o cristal flutuante na frente
  useEffect(() => {
    if (!frontCrystalRef.current) return;
    
    const crystal = frontCrystalRef.current;
    
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

  // Carregar o modelo ativo do Supabase
  useEffect(() => {
    const fetchActiveModel = async () => {
      try {
        setLoadingModel(true);
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          console.log("Modelo ativo encontrado:", data);
          // Cast model_type to ensure type safety
          const typedData = {
            ...data,
            model_type: data.model_type as ModelType
          };
          
          localStorage.setItem("preferredModel", typedData.model_type);
          setCurrentModel(typedData.model_type);
          
          if (typedData.model_type === 'sketchfab' && typedData.url) {
            setSketchfabUrl(typedData.url);
            setSketchfabModelData(typedData as SavedModel);
            localStorage.setItem("sketchfabUrl", typedData.url);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar modelo ativo:", error);
        setLoadingError("Não foi possível carregar o modelo ativo. Por favor, verifique a conexão.");
      } finally {
        setLoadingModel(false);
      }
    };
    
    fetchActiveModel();
  }, []);

  // Renderizar o modelo 3D ou o iframe do Sketchfab
  useEffect(() => {
    if (currentModel === 'sketchfab') {
      // Se for um modelo do Sketchfab, não é necessário inicializar o Three.js
      console.log("Usando modelo do Sketchfab:", sketchfabUrl);
      setLoadingModel(false);
      return;
    }
    
    if (!mountRef.current) return;
    
    setLoadingError(null);
    setModelLoaded(false);
    setLoadingModel(true);
    
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
        setLoadingModel(false);
        console.log("Diamante criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar diamante:", error);
        setLoadingError("Erro ao criar o modelo de diamante");
        setLoadingModel(false);
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
        setLoadingModel(false);
        console.log("Cristal distorcido criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar cristal:", error);
        setLoadingError("Erro ao criar o modelo de cristal");
        setLoadingModel(false);
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
        setLoadingModel(false);
        console.log("Esfera criada com sucesso");
      } catch (error) {
        console.error("Erro ao criar esfera:", error);
        setLoadingError("Erro ao criar o modelo de esfera");
        setLoadingModel(false);
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
        setLoadingModel(false);
        console.log("Torus criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar torus:", error);
        setLoadingError("Erro ao criar o modelo de anel");
        setLoadingModel(false);
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
          setLoadingModel(false);
        },
        (xhr) => {
          console.log("Progresso:", (xhr.loaded / xhr.total * 100) + "% carregado");
        },
        (error) => {
          console.error("Erro ao carregar modelo GLTF:", error);
          setLoadingError("Erro ao carregar o modelo 3D");
          setLoadingModel(false);
        }
      );
    };
    
    // Função para criar um ambiente básico quando o HDR falhar
    const createBasicEnvironment = () => {
      console.log("Criando ambiente básico");
      
      // Criar um ambiente simples como fallback
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      
      // Criar uma cena de ambiente simples
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x111122);
      
      // Criar um cubo para reflexões
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      cubeCamera.update(renderer, envScene);
      
      // Criar mapa de ambiente
      const envMap = pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
      
      // Aplicar à cena
      scene.environment = envMap;
      pmremGenerator.dispose();
      
      console.log("Ambiente básico criado com sucesso");
    };

    // Selecionar o modelo correto com base na preferência
    console.log("Selecionando modelo:", currentModel);
    if (currentModel === 'diamond') {
      createDiamondGeometry();
    } else if (currentModel === 'sphere') {
      createSphereModel();
    } else if (currentModel === 'torus') {
      createTorusModel();
    } else if (currentModel === 'crystal' || currentModel === 'gltf') {
      createCrystalGeometry();
    } else {
      // Fallback para o modelo de cristal se não reconhecer
      createCrystalGeometry();
    }
    
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
    
    // Criar ambiente básico diretamente em vez de tentar carregar HDR
    createBasicEnvironment();
    
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
      
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, [currentModel, modelParams]);
  
  // Efeito para lidar com o modelo do Sketchfab
  useEffect(() => {
    if (currentModel !== 'sketchfab' || !sketchfabContainerRef.current) return;
    
    // Se estiver carregando um modelo do Sketchfab, limpar e criar o iframe
    const container = sketchfabContainerRef.current;
    container.innerHTML = '';
    
    if (sketchfabUrl) {
      setLoadingModel(true);
      
      try {
        // Verificar se a URL é válida para o Sketchfab
        const isSketchfabUrl = sketchfabUrl.includes('sketchfab.com');
        if (!isSketchfabUrl) {
          throw new Error("URL inválida para o Sketchfab");
        }
        
        // Transformar para URL de embed se for uma URL normal
        let embedUrl = sketchfabUrl;
        if (sketchfabUrl.includes('sketchfab.com/models/') && !sketchfabUrl.includes('/embed')) {
          embedUrl = sketchfabUrl.replace('sketchfab.com/models/', 'sketchfab.com/models/embed/');
        }
        
        // Garantir que a URL termina com parâmetros adequados
        if (!embedUrl.includes('?')) {
          embedUrl += '?';
        } else if (!embedUrl.endsWith('&') && !embedUrl.endsWith('?')) {
          embedUrl += '&';
        }
        
        // Adicionar parâmetros para melhor visualização
        embedUrl += 'autostart=1&transparent=1&ui_infos=0&ui_controls=0&ui_stop=0';
        
        console.log("URL de embed final:", embedUrl);
        
        // Criar iframe para o Sketchfab
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay; fullscreen; vr';
        iframe.src = embedUrl;
        
        // Tratar erros de carregamento do iframe
        iframe.onerror = () => {
          setLoadingError("Erro ao carregar o modelo do Sketchfab");
          setLoadingModel(false);
        };
        
        iframe.onload = () => {
          setLoadingModel(false);
        };
        
        container.appendChild(iframe);
      } catch (error) {
        console.error("Erro ao configurar iframe do Sketchfab:", error);
        setLoadingError("URL do modelo Sketchfab inválida");
        setLoadingModel(false);
      }
    } else {
      setLoadingError("URL do modelo Sketchfab não encontrada");
      setLoadingModel(false);
    }
    
    return () => {
      // Cleanup
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [currentModel, sketchfabUrl]);
  
  // Verificar alterações nos parâmetros e textos salvos no localStorage
  useEffect(() => {
    const checkForUpdates = () => {
      // Verificar parâmetros do modelo
      const savedParams = localStorage.getItem("modelParameters");
      if (savedParams) {
        const newParams = JSON.parse(savedParams);
        // Comparar com os parâmetros atuais para ver se precisa atualizar
        if (JSON.stringify(newParams) !== JSON.stringify(modelParams)) {
          console.log("Atualizando parâmetros do modelo na página inicial");
          setModelParams(newParams);
        }
      }
      
      // Verificar tipo de modelo
      const savedModel = localStorage.getItem("preferredModel");
      if (savedModel && savedModel !== currentModel) {
        console.log("Atualizando tipo de modelo na página inicial:", savedModel);
        setCurrentModel(savedModel);
        
        // Se mudou para Sketchfab, verificar URL
        if (savedModel === 'sketchfab') {
          const url = localStorage.getItem("sketchfabUrl");
          if (url) {
            setSketchfabUrl(url);
          }
        }
      }
      
      // Verificar textos
      const savedTitle = localStorage.getItem("siteTitle");
      if (savedTitle && savedTitle !== titleText) {
        setTitleText(savedTitle);
      }
      
      const savedSubtitle = localStorage.getItem("siteSubtitle");
      if (savedSubtitle && savedSubtitle !== subtitleText) {
        setSubtitleText(savedSubtitle);
      }
    };
    
    // Verificar a cada 500ms por mudanças para uma atualização mais rápida
    const interval = setInterval(checkForUpdates, 500);
    
    // Adicionar event listener para o evento storage
    window.addEventListener('storage', checkForUpdates);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkForUpdates);
    };
  }, [modelParams, currentModel, titleText, subtitleText]);
  
  // Converter quebras de linha no subtítulo
  const formattedSubtitle = subtitleText.split('\n').map((text, i) => (
    <p key={i} className="text-sm uppercase tracking-widest opacity-80">
      {text}
    </p>
  ));
  
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Cristal flutuante na frente do texto */}
      <div 
        ref={frontCrystalRef}
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
        <h1 className="text-7xl sm:text-9xl md:text-[12rem] font-bold tracking-tighter text-red-600 leading-none opacity-90">
          {titleText}
        </h1>
      </div>

      {/* Content overlay */}
      <div className="absolute left-4 sm:left-16 bottom-16 sm:bottom-32 z-20 max-w-xs text-left text-white">
        <div className="animate-fade-in space-y-2">
          {formattedSubtitle}
        </div>
      </div>
      
      {/* Loading indicator */}
      {loadingModel && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <div className="text-white text-xl">Carregando modelo...</div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {loadingError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90">
          <div className="text-red-500 text-2xl mb-4">Erro de carregamento</div>
          <div className="text-white text-lg">{loadingError}</div>
        </div>
      )}
      
      {/* Sketchfab container - mostrado apenas quando o modelo for do Sketchfab */}
      {currentModel === 'sketchfab' ? (
        <div 
          ref={sketchfabContainerRef} 
          className="absolute inset-0 z-10"
        ></div>
      ) : (
        <div 
          ref={mountRef} 
          className="absolute inset-0 z-10"
        ></div>
      )}
    </div>
  );
};

export default Index;
