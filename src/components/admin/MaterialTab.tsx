
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  RotateCcw, 
  Save, 
  Eye,
  EyeOff,
  FileAxis3d,
  Upload, 
  Droplet,
  ImageIcon,
  LucideIcon, 
  Info,
  LoaderIcon,
  MountainSnow,
  Palette,
  Aperture,
  Layers,
  SunMedium,
  CheckCircle2
} from "lucide-react";
import { ModelParameters, defaultModelParams, materialPresets, environmentPresets } from "@/types/model";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface MaterialTabProps {
  modelParams: ModelParameters;
  updateModelParam: (param: keyof ModelParameters, value: number | string) => void;
  resetModelParams: () => void;
  saveModelSettings: () => void;
  isColorPickerOpen: string | null;
  setIsColorPickerOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

const MaterialTab = ({
  modelParams,
  updateModelParam,
  resetModelParams,
  saveModelSettings,
  isColorPickerOpen,
  setIsColorPickerOpen
}: MaterialTabProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textureInputRef = useRef<HTMLInputElement>(null);
  const normalMapInputRef = useRef<HTMLInputElement>(null);
  const roughnessMapInputRef = useRef<HTMLInputElement>(null);
  const metalnessMapInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("appearance");
  const [previewType, setPreviewType] = useState<"sphere" | "box" | "torus" | "crystal" | "custom">("sphere");
  const [showWireframe, setShowWireframe] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState("studio");
  const [isLoadingHDR, setIsLoadingHDR] = useState(false);
  const [activePreset, setActivePreset] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [sceneRef, setSceneRef] = useState<THREE.Scene | null>(null);
  const [rendererRef, setRendererRef] = useState<THREE.WebGLRenderer | null>(null);
  const [envMapRef, setEnvMapRef] = useState<THREE.Texture | null>(null);
  const [materialRef, setMaterialRef] = useState<THREE.MeshPhysicalMaterial | null>(null);
  const [customModel, setCustomModel] = useState<THREE.BufferGeometry | null>(null);
  
  // Aplicar um preset de material
  const applyPreset = (presetId: string) => {
    const preset = materialPresets.find(p => p.id === presetId);
    if (!preset) return;
    
    setActivePreset(presetId);
    
    // Atualizar parâmetros baseados no preset
    const updatedParams = { ...modelParams, ...preset.params };
    
    // Atualizar cada parâmetro individualmente para garantir que os componentes da UI atualizem
    Object.entries(updatedParams).forEach(([key, value]) => {
      updateModelParam(key as keyof ModelParameters, value);
    });
    
    setToastMessage(`Preset de material "${preset.name}" aplicado com sucesso!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Lidar com upload de HDR
  const handleHDRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoadingHDR(true);
    setProgressMessage("Carregando arquivo HDR...");
    
    try {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        if (event.target?.result && sceneRef && rendererRef) {
          const rgbeLoader = new RGBELoader();
          
          rgbeLoader.load(
            event.target.result as string,
            (texture) => {
              texture.mapping = THREE.EquirectangularReflectionMapping;
              
              const pmremGenerator = new THREE.PMREMGenerator(rendererRef);
              pmremGenerator.compileEquirectangularShader();
              
              const envMap = pmremGenerator.fromEquirectangular(texture).texture;
              
              sceneRef.environment = envMap;
              
              if (envMapRef) {
                envMapRef.dispose();
              }
              
              setEnvMapRef(envMap);
              pmremGenerator.dispose();
              
              setToastMessage("HDR carregado com sucesso!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              
              setIsLoadingHDR(false);
              setProgressMessage("");
            },
            (xhr) => {
              const percentComplete = xhr.loaded / xhr.total * 100;
              setProgressMessage(`Carregando HDR: ${Math.round(percentComplete)}%`);
            },
            (error) => {
              console.error('Erro ao carregar HDR:', error);
              setToastMessage("Erro ao carregar HDR. Verifique o formato do arquivo.");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              setIsLoadingHDR(false);
              setProgressMessage("");
            }
          );
        }
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Erro ao processar arquivo HDR:', error);
      setToastMessage("Erro ao processar HDR.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsLoadingHDR(false);
      setProgressMessage("");
    }
  };
  
  // Lidar com upload de modelo 3D
  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setProgressMessage("Carregando modelo 3D...");
    
    // Aqui você precisaria de um loader específico para cada formato
    // Exemplo simplificado para demonstração
    setTimeout(() => {
      setIsUploading(false);
      setProgressMessage("");
      setToastMessage("Recursos de importação de modelo serão implementados em breve!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };
  
  // Lidar com upload de textura
  const handleTextureUpload = (type: 'diffuse' | 'normal' | 'roughness' | 'metalness', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setProgressMessage(`Carregando textura ${type}...`);
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
      if (event.target?.result && materialRef) {
        const loader = new THREE.TextureLoader();
        loader.load(
          event.target.result as string,
          (texture) => {
            if (type === 'diffuse') {
              materialRef.map = texture;
              materialRef.needsUpdate = true;
              updateModelParam('textureMap', event.target?.result as string);
            } else if (type === 'normal') {
              materialRef.normalMap = texture;
              materialRef.needsUpdate = true;
              updateModelParam('normalMap', event.target?.result as string);
            } else if (type === 'roughness') {
              materialRef.roughnessMap = texture;
              materialRef.needsUpdate = true;
              updateModelParam('roughnessMap', event.target?.result as string);
            } else if (type === 'metalness') {
              materialRef.metalnessMap = texture;
              materialRef.needsUpdate = true;
              updateModelParam('metalnessMap', event.target?.result as string);
            }
            
            setToastMessage(`Textura ${type} carregada com sucesso!`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsUploading(false);
            setProgressMessage("");
          },
          (xhr) => {
            const percentComplete = xhr.loaded / xhr.total * 100;
            setProgressMessage(`Carregando textura ${type}: ${Math.round(percentComplete)}%`);
          },
          (error) => {
            console.error(`Erro ao carregar textura ${type}:`, error);
            setToastMessage(`Erro ao carregar textura ${type}.`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsUploading(false);
            setProgressMessage("");
          }
        );
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  // Carregar ambiente HDR predefinido
  const loadEnvironment = (environmentId: string) => {
    const environment = environmentPresets.find(env => env.id === environmentId);
    if (!environment || !sceneRef || !rendererRef) return;
    
    setCurrentEnvironment(environmentId);
    setIsLoadingHDR(true);
    setProgressMessage(`Carregando ambiente ${environment.name}...`);
    
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      environment.hdriPath,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        
        const pmremGenerator = new THREE.PMREMGenerator(rendererRef);
        pmremGenerator.compileEquirectangularShader();
        
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        
        sceneRef.environment = envMap;
        
        if (envMapRef) {
          envMapRef.dispose();
        }
        
        setEnvMapRef(envMap);
        pmremGenerator.dispose();
        
        setToastMessage(`Ambiente "${environment.name}" carregado!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        setIsLoadingHDR(false);
        setProgressMessage("");
      },
      (xhr) => {
        const percentComplete = xhr.loaded / xhr.total * 100;
        setProgressMessage(`Carregando ambiente: ${Math.round(percentComplete)}%`);
      },
      (error) => {
        console.error('Erro ao carregar ambiente:', error);
        setToastMessage("Erro ao carregar ambiente.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setIsLoadingHDR(false);
        setProgressMessage("");
      }
    );
  };

  // UseEffect para renderizar o modelo 3D de prévia
  useEffect(() => {
    if (!previewRef.current) return;

    // Limpar qualquer canvas existente
    while (previewRef.current.firstChild) {
      previewRef.current.removeChild(previewRef.current.firstChild);
    }

    // Configurar scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    setSceneRef(scene);

    // Configurar camera
    const camera = new THREE.PerspectiveCamera(
      75,
      previewRef.current.clientWidth / previewRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Configurar renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(previewRef.current.clientWidth, previewRef.current.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = modelParams.lightIntensity;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    setRendererRef(renderer);
    
    previewRef.current.appendChild(renderer.domElement);

    // Configurar controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

    // Material configurável baseado nos parâmetros atuais
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
      iridescenceIOR: modelParams.iridescenceIOR,
      emissive: new THREE.Color(modelParams.emissiveColor),
      emissiveIntensity: modelParams.emissiveIntensity,
      wireframe: modelParams.wireframe || showWireframe,
      transparent: modelParams.transparent,
      opacity: modelParams.opacity,
      side: modelParams.side === 'double' 
        ? THREE.DoubleSide 
        : modelParams.side === 'back' 
          ? THREE.BackSide 
          : THREE.FrontSide
    });
    
    setMaterialRef(material);

    // Criar modelo com base no tipo selecionado
    let geometry: THREE.BufferGeometry;
    
    if (previewType === "sphere") {
      geometry = new THREE.SphereGeometry(2, 64, 64);
    } else if (previewType === "box") {
      geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5, 2, 2, 2);
    } else if (previewType === "torus") {
      geometry = new THREE.TorusGeometry(1.5, 0.6, 16, 100);
    } else if (previewType === "crystal") {
      // Crystal (icosahedron com distorção)
      geometry = new THREE.IcosahedronGeometry(2, 1);
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
          
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        
        // Aplicar distorção
        const distortionFactor = 0.2;
        const noise = Math.sin(vertex.x * 5) * Math.sin(vertex.y * 3) * Math.sin(vertex.z * 7);
        
        vertex.x += noise * distortionFactor;
        vertex.y += noise * distortionFactor;
        vertex.z += noise * distortionFactor;
        
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();
    } else if (customModel) {
      geometry = customModel;
    } else {
      geometry = new THREE.SphereGeometry(2, 64, 64);
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Criar wireframe adicional se não estiver usando o wireframe do material
    if (!showWireframe && !modelParams.wireframe) {
      const wireframeGeometry = new THREE.WireframeGeometry(geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
      });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      scene.add(wireframe);
    }

    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Adicionar uma segunda luz para melhorar o visual
    const secondaryLight = new THREE.DirectionalLight(0x8080ff, 0.5);
    secondaryLight.position.set(-5, -5, -5);
    scene.add(secondaryLight);

    // Criar ambiente com HDRI básico
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();
    
    // Carregar o ambiente selecionado
    loadEnvironment(currentEnvironment);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Função para redimensionar o canvas quando a janela é redimensionada
    const handleResize = () => {
      if (!previewRef.current) return;
      
      const width = previewRef.current.clientWidth;
      const height = previewRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (previewRef.current && previewRef.current.contains(renderer.domElement)) {
        previewRef.current.removeChild(renderer.domElement);
      }
      
      scene.clear();
      renderer.dispose();
      
      if (envMapRef) {
        envMapRef.dispose();
      }
    };
  }, [modelParams, previewType, showWireframe, currentEnvironment, customModel]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gradient">
          <Droplet className="text-purple-400" size={24} />
          Material & Efeitos
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview do Material */}
        <div className="lg:order-2">
          <Card className="neo-blur bg-black/30 border-white/10 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center text-white/90">
                <span>Prévia do Material</span>
                <div className="flex gap-2 items-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 px-2 text-xs bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={() => updateModelParam("wireframe", !modelParams.wireframe)}
                  >
                    {modelParams.wireframe ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                    {modelParams.wireframe ? "Ocultar Wireframe" : "Mostrar Wireframe"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="w-full h-96 bg-black/50 rounded-md">
                <div ref={previewRef} className="w-full h-full"></div>
              </div>
              
              {/* Seletores de forma para a prévia */}
              <div className="absolute left-3 top-3 z-10">
                <div className="neo-blur p-1 rounded-md border border-white/10">
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setPreviewType("sphere")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "sphere" ? 'bg-purple-600/80' : 'bg-black/40 hover:bg-white/10'}`}
                      title="Esfera"
                    >
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </button>
                    <button 
                      onClick={() => setPreviewType("box")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "box" ? 'bg-purple-600/80' : 'bg-black/40 hover:bg-white/10'}`}
                      title="Cubo"
                    >
                      <div className="w-4 h-4 bg-white"></div>
                    </button>
                    <button 
                      onClick={() => setPreviewType("torus")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "torus" ? 'bg-purple-600/80' : 'bg-black/40 hover:bg-white/10'}`}
                      title="Torus"
                    >
                      <div className="w-5 h-3 border-2 border-white rounded-full"></div>
                    </button>
                    <button 
                      onClick={() => setPreviewType("crystal")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "crystal" ? 'bg-purple-600/80' : 'bg-black/40 hover:bg-white/10'}`}
                      title="Cristal"
                    >
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-white transform rotate-180"></div>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 flex items-center justify-center rounded-sm bg-black/40 hover:bg-white/10"
                      title="Carregar Modelo 3D"
                    >
                      <Upload size={14} className="text-white" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleModelUpload}
                        accept=".glb,.gltf,.obj,.fbx,.stl"
                        className="hidden"
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Toast para notificações */}
              {showToast && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600/90 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
                  <CheckCircle2 size={16} />
                  <span className="text-sm">{toastMessage}</span>
                </div>
              )}
              
              {/* Mensagem de progresso */}
              {(isLoadingHDR || isUploading) && progressMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <LoaderIcon className="h-8 w-8 animate-spin text-purple-500" />
                    <p className="text-white">{progressMessage}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Presets de Materiais */}
          <Card className="neo-blur bg-black/30 border-white/10 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white/90">Presets de Materiais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {materialPresets.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`cursor-pointer group relative overflow-hidden rounded-md ${activePreset === preset.id ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="aspect-square bg-gray-900">
                      <img 
                        src={preset.thumbnail} 
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm py-1 px-2">
                      <p className="text-xs text-white truncate">{preset.name}</p>
                    </div>
                    <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-black/40 backdrop-blur-md border-white/10 hover:bg-white/10 text-white"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Presets de Ambientes */}
          <Card className="neo-blur bg-black/30 border-white/10 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white/90 flex items-center justify-between">
                <span>Iluminação & Ambiente</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 px-2 text-xs bg-white/5 border-white/10 hover:bg-white/10"
                      >
                        <Upload size={14} className="mr-1" />
                        Carregar HDR
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="neo-blur bg-black/80 border-white/10">
                      <p>Carregar arquivo HDR para iluminação</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleHDRUpload}
                  accept=".hdr,.exr"
                  className="hidden"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {environmentPresets.map((env) => (
                  <div 
                    key={env.id}
                    onClick={() => loadEnvironment(env.id)}
                    className={`cursor-pointer group relative overflow-hidden rounded-md ${currentEnvironment === env.id ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="aspect-video bg-gray-900">
                      <img 
                        src={env.thumbnail} 
                        alt={env.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm py-1 px-2">
                      <p className="text-xs text-white truncate">{env.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-white/90">Intensidade da Luz</Label>
                  <span className="text-xs text-gray-400">{modelParams.lightIntensity.toFixed(1)}</span>
                </div>
                <Slider 
                  value={[modelParams.lightIntensity]} 
                  min={0.1} 
                  max={3} 
                  step={0.1} 
                  onValueChange={(value) => updateModelParam("lightIntensity", value[0])}
                  className="py-4"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles do Material */}
        <div className="lg:order-1">
          <Card className="neo-blur bg-black/30 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center text-white/90">
                <span>Parâmetros do Material</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs sm:text-sm bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={resetModelParams}
                  >
                    <RotateCcw size={14} className="mr-1" />
                    Resetar
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 text-xs sm:text-sm bg-purple-600/80 hover:bg-purple-700/80"
                    onClick={saveModelSettings}
                  >
                    <Save size={14} className="mr-1" />
                    Salvar
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-white/60">
                Ajuste os parâmetros para personalizar a aparência do modelo 3D
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-4 mb-4 neo-blur bg-black/40 border border-white/10">
                  <TabsTrigger 
                    value="appearance" 
                    className="text-xs sm:text-sm data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=inactive]:text-white/70"
                  >
                    <Palette size={14} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Aparência</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transparency" 
                    className="text-xs sm:text-sm data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=inactive]:text-white/70"
                  >
                    <Droplet size={14} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Transparência</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="textures" 
                    className="text-xs sm:text-sm data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=inactive]:text-white/70"
                  >
                    <ImageIcon size={14} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Texturas</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="effects" 
                    className="text-xs sm:text-sm data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=inactive]:text-white/70"
                  >
                    <Aperture size={14} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Efeitos</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Tab Aparência */}
                <TabsContent value="appearance" className="space-y-4">
                  <div className="space-y-4">
                    {/* Seletor de Cor */}
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Cor do Material</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-12 h-12 rounded-md cursor-pointer border border-white/10"
                          style={{ backgroundColor: modelParams.color }}
                          onClick={() => setIsColorPickerOpen(isColorPickerOpen === "material" ? null : "material")}
                        ></div>
                        <Input 
                          value={modelParams.color} 
                          onChange={(e) => updateModelParam("color", e.target.value)}
                          className="bg-black/40 backdrop-blur-md border-white/10 text-white"
                        />
                      </div>
                      {isColorPickerOpen === "material" && (
                        <div className="relative z-10 mt-2">
                          <div className="absolute">
                            <HexColorPicker 
                              color={modelParams.color} 
                              onChange={(color) => updateModelParam("color", color)} 
                            />
                            <button 
                              className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-white"
                              onClick={() => setIsColorPickerOpen(null)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Metalness Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Metalicidade</Label>
                        <span className="text-xs text-gray-400">{modelParams.metalness.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.metalness]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("metalness", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Roughness Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Rugosidade</Label>
                        <span className="text-xs text-gray-400">{modelParams.roughness.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.roughness]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("roughness", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Env Map Intensity Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Intensidade do Ambiente</Label>
                        <span className="text-xs text-gray-400">{modelParams.envMapIntensity.toFixed(1)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.envMapIntensity]} 
                        min={0} 
                        max={5} 
                        step={0.1} 
                        onValueChange={(value) => updateModelParam("envMapIntensity", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Wireframe Toggle */}
                    <div className="flex items-center justify-between space-y-0 pt-2">
                      <Label htmlFor="wireframe" className="text-sm text-white/90">
                        Wireframe
                      </Label>
                      <Switch
                        id="wireframe"
                        checked={modelParams.wireframe}
                        onCheckedChange={(checked) => updateModelParam("wireframe", checked)}
                      />
                    </div>
                    
                    {/* Side Selector */}
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Renderização de Faces</Label>
                      <Select
                        value={modelParams.side}
                        onValueChange={(value) => updateModelParam("side", value as 'front' | 'back' | 'double')}
                      >
                        <SelectTrigger className="bg-black/40 backdrop-blur-md border-white/10 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="neo-blur bg-black/80 border-white/10">
                          <SelectItem value="front" className="text-white">Frontal</SelectItem>
                          <SelectItem value="back" className="text-white">Traseira</SelectItem>
                          <SelectItem value="double" className="text-white">Ambos os lados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab Transparência */}
                <TabsContent value="transparency" className="space-y-4">
                  <div className="space-y-4">
                    {/* Transparent Toggle */}
                    <div className="flex items-center justify-between space-y-0 py-2">
                      <Label htmlFor="transparent" className="text-sm text-white/90 flex items-center gap-2">
                        Material Transparente
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={14} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="neo-blur bg-black/80 border-white/10">
                              <p>Ative para permitir transparência</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Switch
                        id="transparent"
                        checked={modelParams.transparent}
                        onCheckedChange={(checked) => updateModelParam("transparent", checked)}
                      />
                    </div>
                  
                    {/* Opacity Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Opacidade</Label>
                        <span className="text-xs text-gray-400">{modelParams.opacity.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.opacity]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("opacity", value[0])}
                        className="py-4"
                        disabled={!modelParams.transparent}
                      />
                    </div>
                    
                    {/* Transmission Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90 flex items-center gap-2">
                          Transmissão
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="neo-blur bg-black/80 border-white/10">
                                <p>Quanto maior o valor, mais transparente e refrativo o material</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <span className="text-xs text-gray-400">{modelParams.transmission.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.transmission]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("transmission", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Thickness Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Espessura</Label>
                        <span className="text-xs text-gray-400">{modelParams.thickness.toFixed(1)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.thickness]} 
                        min={0} 
                        max={5} 
                        step={0.1} 
                        onValueChange={(value) => updateModelParam("thickness", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* IOR Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90 flex items-center gap-2">
                          Índice de Refração (IOR)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="neo-blur bg-black/80 border-white/10 max-w-sm">
                                <div className="space-y-1">
                                  <p>Valores comuns de IOR:</p>
                                  <p>- Ar: 1.0</p>
                                  <p>- Água: 1.33</p>
                                  <p>- Vidro: 1.45-1.9</p>
                                  <p>- Diamante: 2.42</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <span className="text-xs text-gray-400">{modelParams.ior.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.ior]} 
                        min={1} 
                        max={4} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("ior", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Reflectivity Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Refletividade</Label>
                        <span className="text-xs text-gray-400">{modelParams.reflectivity.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.reflectivity]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("reflectivity", value[0])}
                        className="py-4"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab Texturas */}
                <TabsContent value="textures" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Mapa de Textura (Diffuse)</Label>
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          className="w-10 h-10 bg-gray-800 border border-white/10 rounded flex items-center justify-center overflow-hidden"
                        >
                          {modelParams.textureMap ? (
                            <img 
                              src={modelParams.textureMap} 
                              alt="Textura" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={16} className="text-gray-500" />
                          )}
                        </div>
                        <Input
                          readOnly
                          value={modelParams.textureMap ? "Textura carregada" : "Nenhuma textura"}
                          className="bg-black/40 backdrop-blur-md border-white/10 text-white flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => textureInputRef.current?.click()}
                          className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                          <Upload size={14} />
                        </Button>
                        <input
                          type="file"
                          ref={textureInputRef}
                          onChange={(e) => handleTextureUpload('diffuse', e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Mapa Normal</Label>
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          className="w-10 h-10 bg-gray-800 border border-white/10 rounded flex items-center justify-center overflow-hidden"
                        >
                          {modelParams.normalMap ? (
                            <img 
                              src={modelParams.normalMap} 
                              alt="Normal Map" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Layers size={16} className="text-gray-500" />
                          )}
                        </div>
                        <Input
                          readOnly
                          value={modelParams.normalMap ? "Normal map carregado" : "Nenhum normal map"}
                          className="bg-black/40 backdrop-blur-md border-white/10 text-white flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => normalMapInputRef.current?.click()}
                          className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                          <Upload size={14} />
                        </Button>
                        <input
                          type="file"
                          ref={normalMapInputRef}
                          onChange={(e) => handleTextureUpload('normal', e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Mapa de Rugosidade</Label>
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          className="w-10 h-10 bg-gray-800 border border-white/10 rounded flex items-center justify-center overflow-hidden"
                        >
                          {modelParams.roughnessMap ? (
                            <img 
                              src={modelParams.roughnessMap} 
                              alt="Roughness Map" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={16} className="text-gray-500" />
                          )}
                        </div>
                        <Input
                          readOnly
                          value={modelParams.roughnessMap ? "Mapa de rugosidade carregado" : "Nenhum mapa de rugosidade"}
                          className="bg-black/40 backdrop-blur-md border-white/10 text-white flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => roughnessMapInputRef.current?.click()}
                          className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                          <Upload size={14} />
                        </Button>
                        <input
                          type="file"
                          ref={roughnessMapInputRef}
                          onChange={(e) => handleTextureUpload('roughness', e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Mapa de Metalicidade</Label>
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          className="w-10 h-10 bg-gray-800 border border-white/10 rounded flex items-center justify-center overflow-hidden"
                        >
                          {modelParams.metalnessMap ? (
                            <img 
                              src={modelParams.metalnessMap} 
                              alt="Metalness Map" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={16} className="text-gray-500" />
                          )}
                        </div>
                        <Input
                          readOnly
                          value={modelParams.metalnessMap ? "Mapa de metalicidade carregado" : "Nenhum mapa de metalicidade"}
                          className="bg-black/40 backdrop-blur-md border-white/10 text-white flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => metalnessMapInputRef.current?.click()}
                          className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                          <Upload size={14} />
                        </Button>
                        <input
                          type="file"
                          ref={metalnessMapInputRef}
                          onChange={(e) => handleTextureUpload('metalness', e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Intensidade do Mapa de Oclusão Ambiente</Label>
                      <Slider 
                        value={[modelParams.aoMapIntensity]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("aoMapIntensity", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Escala de Deslocamento</Label>
                      <Slider 
                        value={[modelParams.displacementScale]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("displacementScale", value[0])}
                        className="py-4"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab Efeitos */}
                <TabsContent value="effects" className="space-y-4">
                  <div className="space-y-5">
                    {/* Clearcoat Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90 flex items-center gap-2">
                          Clearcoat
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="neo-blur bg-black/80 border-white/10">
                                <p>Adiciona uma camada brilhante acima do material</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <span className="text-xs text-gray-400">{modelParams.clearcoat.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.clearcoat]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("clearcoat", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Clearcoat Roughness Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Rugosidade do Clearcoat</Label>
                        <span className="text-xs text-gray-400">{modelParams.clearcoatRoughness.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.clearcoatRoughness]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("clearcoatRoughness", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    {/* Emissive Color */}
                    <div className="space-y-2">
                      <Label className="text-sm text-white/90">Cor Emissiva</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-12 h-12 rounded-md cursor-pointer border border-white/10"
                          style={{ backgroundColor: modelParams.emissiveColor }}
                          onClick={() => setIsColorPickerOpen(isColorPickerOpen === "emissive" ? null : "emissive")}
                        ></div>
                        <Input 
                          value={modelParams.emissiveColor} 
                          onChange={(e) => updateModelParam("emissiveColor", e.target.value)}
                          className="bg-black/40 backdrop-blur-md border-white/10 text-white"
                        />
                      </div>
                      {isColorPickerOpen === "emissive" && (
                        <div className="relative z-10 mt-2">
                          <div className="absolute">
                            <HexColorPicker 
                              color={modelParams.emissiveColor} 
                              onChange={(color) => updateModelParam("emissiveColor", color)} 
                            />
                            <button 
                              className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-white"
                              onClick={() => setIsColorPickerOpen(null)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Emissive Intensity */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">Intensidade Emissiva</Label>
                        <span className="text-xs text-gray-400">{modelParams.emissiveIntensity.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.emissiveIntensity]} 
                        min={0} 
                        max={2} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("emissiveIntensity", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    {/* Iridescence Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90 flex items-center gap-2">
                          Iridescência
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="neo-blur bg-black/80 border-white/10">
                                <p>Efeito de mudança de cor conforme o ângulo de visão</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <span className="text-xs text-gray-400">{modelParams.iridescence.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.iridescence]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("iridescence", value[0])}
                        className="py-4"
                      />
                    </div>
                    
                    {/* Iridescence IOR Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-white/90">IOR da Iridescência</Label>
                        <span className="text-xs text-gray-400">{modelParams.iridescenceIOR.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[modelParams.iridescenceIOR]} 
                        min={1} 
                        max={3} 
                        step={0.01} 
                        onValueChange={(value) => updateModelParam("iridescenceIOR", value[0])}
                        className="py-4"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="w-full neo-blur bg-purple-900/20 rounded-md p-3 text-sm text-purple-300 border border-purple-700/30">
                <p>Estas configurações afetam todos os modelos 3D do site, incluindo os modelos padrão e os personalizados.</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
