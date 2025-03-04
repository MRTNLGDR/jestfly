
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ModelParameters } from "@/types/modelParameters";

interface CrystalSceneProps {
  currentModel: string;
  modelParams: ModelParameters;
  onLoaded: () => void;
  onError: (error: string) => void;
}

const CrystalScene: React.FC<CrystalSceneProps> = ({
  currentModel,
  modelParams,
  onLoaded,
  onError
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (currentModel === 'sketchfab') {
      // Se for um modelo do Sketchfab, não é necessário inicializar o Three.js
      console.log("Usando modelo do Sketchfab - Three.js não inicializado");
      return;
    }
    
    if (!mountRef.current) return;
    
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
        onLoaded();
        console.log("Diamante criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar diamante:", error);
        onError("Erro ao criar o modelo de diamante");
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
        onLoaded();
        console.log("Cristal distorcido criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar cristal:", error);
        onError("Erro ao criar o modelo de cristal");
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
        onLoaded();
        console.log("Esfera criada com sucesso");
      } catch (error) {
        console.error("Erro ao criar esfera:", error);
        onError("Erro ao criar o modelo de esfera");
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
        onLoaded();
        console.log("Torus criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar torus:", error);
        onError("Erro ao criar o modelo de anel");
      }
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
  }, [currentModel, modelParams, onLoaded, onError]);

  return <div ref={mountRef} className="absolute inset-0 z-10"></div>;
};

export default CrystalScene;
