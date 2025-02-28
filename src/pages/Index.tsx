
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Loader2 } from "lucide-react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { ModelParameters, defaultModelParams } from "@/types/model";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface SavedModel {
  id: string;
  name: string;
  model_type: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
  url: string | null;
  thumbnail_url: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at?: string;
  params?: Json | null;
}

const Index = () => {
  const mountRef = useRef<HTMLCanvasElement>(null);
  const sketchfabContainerRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const frontCrystalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  
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
    // Se não existir parâmetros salvos, usar os padrões do vidro brilhante
    if (!savedParams) {
      // Salvar os parâmetros otimizados para vidro
      const glassParams = {
        ...defaultModelParams,
        color: "#ffffff",
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.98,
        thickness: 0.2,
        envMapIntensity: 3.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        ior: 1.5,
        reflectivity: 1.0,
        transparent: true,
        opacity: 0.2
      };
      localStorage.setItem("modelParameters", JSON.stringify(glassParams));
      return glassParams;
    }
    return JSON.parse(savedParams);
  });

  // Efeito para aplicar a distorção do texto
  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const createFragmentedText = () => {
      const originalText = titleText;
      const fragmentCount = 10; // Número de fragmentos
      
      // Limpar o elemento de título
      titleElement.innerHTML = '';
      
      // Criar uma série de divs para os fragmentos
      for (let i = 0; i < originalText.length; i++) {
        const char = originalText[i];
        
        // Para cada caractere, criar vários fragmentos sobrepostos com distorções diferentes
        const charContainer = document.createElement('span');
        charContainer.style.position = 'relative';
        charContainer.style.display = 'inline-block';
        
        for (let j = 0; j < fragmentCount; j++) {
          const fragment = document.createElement('span');
          fragment.textContent = char;
          fragment.style.position = 'absolute';
          fragment.style.left = '0';
          fragment.style.top = '0';
          fragment.style.color = '#d1174a'; // Cor base vermelho
          
          // Aplicar distorções aleatórias leves
          const skewX = Math.random() * 10 - 5;
          const skewY = Math.random() * 10 - 5;
          const offsetX = Math.random() * 6 - 3;
          const offsetY = Math.random() * 6 - 3;
          const rotate = Math.random() * 10 - 5;
          
          fragment.style.transform = `translate(${offsetX}px, ${offsetY}px) skew(${skewX}deg, ${skewY}deg) rotate(${rotate}deg)`;
          fragment.style.opacity = (0.6 + Math.random() * 0.4).toString();
          fragment.style.zIndex = j.toString();
          fragment.style.mixBlendMode = 'screen';
          fragment.style.textShadow = `0 0 ${Math.random() * 3}px rgba(255,255,255,0.5)`;
          
          charContainer.appendChild(fragment);
        }
        
        // Adicionar o caractere base (que será visível)
        const baseChar = document.createElement('span');
        baseChar.textContent = char;
        baseChar.style.position = 'relative';
        baseChar.style.zIndex = fragmentCount.toString();
        baseChar.style.color = '#d1174a'; // Cor base vermelho
        charContainer.appendChild(baseChar);
        
        titleElement.appendChild(charContainer);
      }
    };
    
    createFragmentedText();
    
    // Criar uma animação suave para os fragmentos
    let frameId: number;
    const animateFragments = () => {
      const fragments = titleElement.querySelectorAll('span > span:not(:last-child)');
      
      fragments.forEach((fragment) => {
        const el = fragment as HTMLElement;
        
        // Sutilmente alterar a transformação ao longo do tempo
        const skewX = Math.random() * 10 - 5;
        const skewY = Math.random() * 10 - 5;
        const offsetX = Math.random() * 6 - 3;
        const offsetY = Math.random() * 6 - 3;
        const rotate = Math.random() * 10 - 5;
        
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) skew(${skewX}deg, ${skewY}deg) rotate(${rotate}deg)`;
        el.style.opacity = (0.6 + Math.random() * 0.4).toString();
      });
      
      frameId = requestAnimationFrame(animateFragments);
    };
    
    animateFragments();
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [titleText]);

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
          localStorage.setItem("preferredModel", data.model_type);
          setCurrentModel(data.model_type);
          
          if (data.model_type === 'sketchfab' && data.url) {
            setSketchfabUrl(data.url);
            setSketchfabModelData(data);
            localStorage.setItem("sketchfabUrl", data.url);
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

  // Renderizar com Babylon.js
  useEffect(() => {
    if (currentModel === 'sketchfab') {
      // Se for um modelo do Sketchfab, não é necessário inicializar o Babylon.js
      console.log("Usando modelo do Sketchfab:", sketchfabUrl);
      setLoadingModel(false);
      return;
    }

    // Limpeza antes de inicializar
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }
    
    if (!mountRef.current) return;
    
    setLoadingError(null);
    setModelLoaded(false);
    setLoadingModel(true);
    
    console.log("Inicializando cena Babylon.js");
    console.log("Modelo atual:", currentModel);
    console.log("Parâmetros:", modelParams);

    // Inicializar o engine e cena Babylon
    const engine = new BABYLON.Engine(mountRef.current, true, { 
      preserveDrawingBuffer: true, 
      stencil: true,
      alpha: true
    });
    engineRef.current = engine;
    
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    
    // Configurar fundo transparente
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
    // Criar câmera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,  // alfa - rotação horizontal
      Math.PI / 2.5, // beta - rotação vertical
      5,             // raio - distância
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(mountRef.current, true);
    camera.wheelDeltaPercentage = 0.01; // Reduzir velocidade do zoom
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 10;
    // Desativar zoom com a roda do mouse
    camera.inputs.attached.mousewheel.detachControl(mountRef.current);
    
    // Definir configurações de controle
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior!.idleRotationSpeed = 0.5;
    
    // Iluminação
    const hemLight = new BABYLON.HemisphericLight(
      "hemLight", 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    hemLight.intensity = 0.6;
    hemLight.diffuse = new BABYLON.Color3(1, 1, 1);
    hemLight.specular = new BABYLON.Color3(0.6, 0.6, 1);
    hemLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.3);
    
    // Luz principal direcional
    const dirLight = new BABYLON.DirectionalLight(
      "dirLight",
      new BABYLON.Vector3(1, -1, 1),
      scene
    );
    dirLight.intensity = 1.0;
    
    // Luzes coloridas para reflexões
    const pointLight1 = new BABYLON.PointLight(
      "pointLight1",
      new BABYLON.Vector3(3, 2, 2),
      scene
    );
    pointLight1.diffuse = new BABYLON.Color3(1, 0.2, 0.4);
    pointLight1.intensity = 0.7;
    
    const pointLight2 = new BABYLON.PointLight(
      "pointLight2",
      new BABYLON.Vector3(-3, -2, 2),
      scene
    );
    pointLight2.diffuse = new BABYLON.Color3(0.5, 0.8, 1);
    pointLight2.intensity = 0.7;

    // Criar ambiente PBR
    const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      "/environment.env", 
      scene
    );
    scene.environmentTexture = envTexture;
    scene.environmentIntensity = 1.5;
    
    // Criar material PBR
    const createGlassMaterial = () => {
      const pbr = new BABYLON.PBRMaterial("glassMaterial", scene);
      
      // Converter o valor de cor hexadecimal em RGB
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.substring(1, 3), 16) / 255;
        const g = parseInt(hex.substring(3, 5), 16) / 255;
        const b = parseInt(hex.substring(5, 7), 16) / 255;
        return new BABYLON.Color3(r, g, b);
      };
      
      pbr.albedoColor = hexToRgb(modelParams.color);
      pbr.metallic = modelParams.metalness;
      pbr.roughness = modelParams.roughness;
      
      // Configurações de transparência
      pbr.alpha = 0.2; // Transparência global
      pbr.useAlphaFromAlbedoTexture = false;
      pbr.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
      
      // Reflexões
      pbr.environmentIntensity = modelParams.envMapIntensity;
      pbr.reflectionColor = new BABYLON.Color3(1, 1, 1);
      pbr.microSurface = 1.0 - modelParams.roughness; // Inverso da rugosidade
      
      // Refração
      pbr.indexOfRefraction = modelParams.ior;
      pbr.subSurface.isRefractionEnabled = true;
      pbr.subSurface.refractionIntensity = 0.9;
      pbr.subSurface.translucencyIntensity = 0.9;
      pbr.subSurface.indexOfRefraction = modelParams.ior;
      
      // Brilho adicional
      pbr.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.2);
      pbr.emissiveIntensity = 0.1;
      
      // No Babylon.js não existe uma propriedade clearcoat direta como no Three.js,
      // mas podemos configurar o material para parecer similar
      pbr.clearCoat.isEnabled = true;
      pbr.clearCoat.intensity = modelParams.clearcoat;
      pbr.clearCoat.roughness = modelParams.clearcoatRoughness;
      
      return pbr;
    };
    
    // Material do vidro
    const glassMaterial = createGlassMaterial();
    
    // Criar função para criar modelos
    let currentMesh: BABYLON.Mesh | null = null;
    
    // Criar diamante
    const createDiamondGeometry = () => {
      const diamondMesh = BABYLON.MeshBuilder.CreatePolyhedron(
        "diamond",
        { type: 1, size: 1.8 },
        scene
      );
      
      // Ajustar escala e aplicar material
      diamondMesh.scaling = new BABYLON.Vector3(1.8, 1.8, 1.8);
      diamondMesh.material = glassMaterial;
      diamondMesh.position.y = 0;
      
      if (currentMesh) {
        currentMesh.dispose();
      }
      
      currentMesh = diamondMesh;
      
      // Adicionar efeito de pulso
      scene.registerBeforeRender(() => {
        const pulseFactor = Math.sin(performance.now() * 0.001) * 0.03 + 1;
        if (diamondMesh) {
          diamondMesh.scaling = new BABYLON.Vector3(
            1.8 * pulseFactor,
            1.8 * pulseFactor,
            1.8 * pulseFactor
          );
          
          // Pequena rotação extra
          diamondMesh.rotation.y += 0.001;
          diamondMesh.rotation.x += 0.0005;
        }
      });
      
      setModelLoaded(true);
      setLoadingModel(false);
    };
    
    // Criar cristal distorcido
    const createCrystalGeometry = () => {
      // Criar um icosaedro (similar ao IcosahedronGeometry do Three.js)
      const crystalMesh = BABYLON.MeshBuilder.CreatePolyhedron(
        "crystal",
        { type: 3, size: 1.5 },
        scene
      );
      
      // Distorcer manualmente os vértices
      const positions = crystalMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      if (positions) {
        const distortionFactor = 0.2;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];
          
          // Aplicar distorção baseada em "noise" similar
          const noise = Math.sin(x * 5) * Math.sin(y * 3) * Math.sin(z * 7);
          
          positions[i] += noise * distortionFactor;
          positions[i + 1] += noise * distortionFactor;
          positions[i + 2] += noise * distortionFactor;
        }
        
        crystalMesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        crystalMesh.createNormals(); // Recalcular normais
      }
      
      // Aplicar material e escala
      crystalMesh.material = glassMaterial;
      crystalMesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
      
      if (currentMesh) {
        currentMesh.dispose();
      }
      
      currentMesh = crystalMesh;
      
      // Adicionar efeito de pulso
      scene.registerBeforeRender(() => {
        const pulseFactor = Math.sin(performance.now() * 0.001) * 0.03 + 1;
        if (crystalMesh) {
          crystalMesh.scaling = new BABYLON.Vector3(
            1.5 * pulseFactor,
            1.5 * pulseFactor,
            1.5 * pulseFactor
          );
          
          // Pequena rotação extra
          crystalMesh.rotation.y += 0.001;
          crystalMesh.rotation.x += 0.0005;
        }
      });
      
      setModelLoaded(true);
      setLoadingModel(false);
    };
    
    // Criar esfera
    const createSphereModel = () => {
      const sphereMesh = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 3, segments: 48 },
        scene
      );
      
      sphereMesh.material = glassMaterial;
      
      if (currentMesh) {
        currentMesh.dispose();
      }
      
      currentMesh = sphereMesh;
      
      // Adicionar efeito de pulso
      scene.registerBeforeRender(() => {
        const pulseFactor = Math.sin(performance.now() * 0.001) * 0.03 + 1;
        if (sphereMesh) {
          sphereMesh.scaling = new BABYLON.Vector3(
            pulseFactor,
            pulseFactor,
            pulseFactor
          );
          
          // Pequena rotação extra
          sphereMesh.rotation.y += 0.001;
          sphereMesh.rotation.x += 0.0005;
        }
      });
      
      setModelLoaded(true);
      setLoadingModel(false);
    };
    
    // Criar torus
    const createTorusModel = () => {
      const torusMesh = BABYLON.MeshBuilder.CreateTorus(
        "torus",
        { diameter: 3, thickness: 1, tessellation: 64 },
        scene
      );
      
      torusMesh.material = glassMaterial;
      
      if (currentMesh) {
        currentMesh.dispose();
      }
      
      currentMesh = torusMesh;
      
      // Adicionar efeito de pulso
      scene.registerBeforeRender(() => {
        const pulseFactor = Math.sin(performance.now() * 0.001) * 0.03 + 1;
        if (torusMesh) {
          torusMesh.scaling = new BABYLON.Vector3(
            pulseFactor,
            pulseFactor,
            pulseFactor
          );
          
          // Pequena rotação extra
          torusMesh.rotation.y += 0.001;
          torusMesh.rotation.x += 0.0005;
        }
      });
      
      setModelLoaded(true);
      setLoadingModel(false);
    };
    
    // Criar linha diagonal (similar à referência)
    const createDiagonalLine = () => {
      const linePoints = [
        new BABYLON.Vector3(-20, 15, -15),
        new BABYLON.Vector3(20, -10, -15)
      ];
      
      const lines = BABYLON.MeshBuilder.CreateLines(
        "diagonalLine",
        { points: linePoints },
        scene
      );
      
      lines.color = new BABYLON.Color3(1, 1, 1);
      lines.alpha = 0.7;
    };
    
    createDiagonalLine();
    
    // Selecionar o modelo correto
    if (currentModel === 'diamond') {
      createDiamondGeometry();
    } else if (currentModel === 'sphere') {
      createSphereModel();
    } else if (currentModel === 'torus') {
      createTorusModel();
    } else if (currentModel === 'crystal' || currentModel === 'gltf') {
      createCrystalGeometry();
    } else {
      // Fallback para cristal se não reconhecer
      createCrystalGeometry();
    }
    
    // Evento de toque para acelerar a rotação
    let touchTimeout: number | null = null;
    const handleTouch = () => {
      if (camera.useAutoRotationBehavior && camera.autoRotationBehavior) {
        camera.autoRotationBehavior.idleRotationSpeed = 3.0;
        
        if (touchTimeout) clearTimeout(touchTimeout);
        touchTimeout = window.setTimeout(() => {
          if (camera.useAutoRotationBehavior && camera.autoRotationBehavior) {
            camera.autoRotationBehavior.idleRotationSpeed = 0.5;
          }
        }, 2000);
      }
    };
    
    // Adicionar listeners
    window.addEventListener('click', handleTouch);
    window.addEventListener('touchstart', handleTouch);
    
    // Iniciar o loop de renderização
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    // Handler para redimensionamento
    const handleResize = () => {
      engine.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      
      if (touchTimeout) clearTimeout(touchTimeout);
      
      scene.dispose();
      engine.dispose();
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
      {/* Logo/Title overlay - COLOCADO ATRÁS (z-10) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1 
          ref={titleRef}
          className="text-7xl sm:text-9xl md:text-[12rem] font-bold tracking-tighter leading-none"
        >
          {titleText}
        </h1>
      </div>
      
      {/* Content overlay - COLOCADO ATRÁS (z-10) */}
      <div className="absolute left-4 sm:left-16 bottom-16 sm:bottom-32 z-10 max-w-xs text-left text-white">
        <div className="animate-fade-in space-y-2">
          {formattedSubtitle}
        </div>
      </div>

      {/* Cristal para distorção de texto */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
            mixBlendMode: "overlay",
          }}
        ></div>
        
        {/* Efeitos de corte e distorção */}
        <div 
          className="absolute top-[40%] left-[45%] w-[20%] h-[30%]"
          style={{
            clipPath: "polygon(0 0, 100% 20%, 80% 100%, 20% 80%)",
            background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(2px) hue-rotate(15deg)",
            WebkitBackdropFilter: "blur(2px) hue-rotate(15deg)",
            mixBlendMode: "overlay",
            transform: "rotate(15deg)",
          }}
        ></div>
        
        <div 
          className="absolute top-[30%] left-[35%] w-[25%] h-[40%]"
          style={{
            clipPath: "polygon(20% 0, 100% 30%, 80% 100%, 0 70%)",
            background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(3px) hue-rotate(-15deg)",
            WebkitBackdropFilter: "blur(3px) hue-rotate(-15deg)",
            mixBlendMode: "overlay",
            transform: "rotate(-10deg)",
          }}
        ></div>
      </div>

      {/* Sketchfab container - mostrado apenas quando o modelo for do Sketchfab */}
      {currentModel === 'sketchfab' ? (
        <div 
          ref={sketchfabContainerRef} 
          className="absolute inset-0 z-20"
        ></div>
      ) : (
        <canvas 
          ref={mountRef} 
          className="absolute inset-0 z-20"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* Camada de refração para simular vidro - aumenta distorções */}
      <div className="refraction-layer"></div>

      {/* Cristal flutuante - colocado na frente (z-50) */}
      <div 
        ref={frontCrystalRef}
        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
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
      <div className="absolute top-4 right-4 z-60">
        <Link 
          to="/admin" 
          className="flex items-center gap-2 px-3 py-2 bg-black/70 hover:bg-black/90 rounded-md text-white transition-colors border border-white/10"
        >
          <Settings size={16} />
          Admin
        </Link>
      </div>
      
      {/* Loading indicator */}
      {loadingModel && (
        <div className="absolute inset-0 flex items-center justify-center z-60 bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <div className="text-white text-xl">Carregando modelo...</div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {loadingError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-60 bg-black/90">
          <div className="text-red-500 text-2xl mb-4">Erro de carregamento</div>
          <div className="text-white text-lg">{loadingError}</div>
        </div>
      )}
    </div>
  );
};

export default Index;
