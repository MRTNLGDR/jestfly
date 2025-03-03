import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  FileAxis3d,
  Check,
  X,
  Plus,
  Folder,
  Diamond,
  Circle,
  CircleDot,
  Loader2
} from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ModelParameters } from "@/types/modelParameters";
import { Card, CardContent } from "@/components/ui/card";
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

interface ModelTabProps {
  uploadedModels: Array<{ name: string; file: File; preview?: string }>;
  setUploadedModels: React.Dispatch<React.SetStateAction<Array<{ name: string; file: File; preview?: string }>>>;
  newModelName: string;
  setNewModelName: React.Dispatch<React.SetStateAction<string>>;
  activeModel: string;
  changeActiveModel: (modelType: string) => void;
}

const ModelTab = ({
  uploadedModels,
  setUploadedModels,
  newModelName,
  setNewModelName,
  activeModel,
  changeActiveModel
}: ModelTabProps) => {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : null;
  });

  useEffect(() => {
    const fetchSavedModels = async () => {
      try {
        setLoadingModels(true);
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        console.log("Modelos carregados:", data);
        setSavedModels(data || []);
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar modelos",
          description: "Não foi possível carregar os modelos do banco de dados."
        });
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchSavedModels();
  }, [toast]);

  const activateModel = async (id: string, modelType: string) => {
    try {
      await supabase
        .from('models')
        .update({ is_active: false })
        .not('id', 'is', null);
      
      const { error } = await supabase
        .from('models')
        .update({ is_active: true })
        .eq('id', id);
      
      if (error) throw error;
      
      const updatedModels = savedModels.map(model => ({
        ...model,
        is_active: model.id === id
      }));
      
      setSavedModels(updatedModels);
      
      changeActiveModel(modelType);
      
      toast({
        title: "Modelo ativo",
        description: "Este modelo agora é exibido na página inicial"
      });
      
      const model = savedModels.find(m => m.id === id);
      if (model && model.model_type === 'sketchfab' && model.url) {
        localStorage.setItem("sketchfabUrl", model.url);
      }
      
    } catch (error) {
      console.error("Erro ao ativar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao ativar modelo",
        description: "Não foi possível definir este modelo como ativo."
      });
    }
  };

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        const newModel = {
          name: newModelName || file.name,
          file: file,
          preview: "/lovable-uploads/69507f0d-bbb9-4e5d-b648-984848675b22.png"
        };
        
        setUploadedModels([...uploadedModels, newModel]);
        setNewModelName("");
        
        toast({
          title: "Modelo adicionado com sucesso",
          description: `${file.name} foi adicionado à biblioteca de modelos.`
        });
      } else {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo GLTF ou GLB válido.",
          variant: "destructive"
        });
      }
    }
  };

  const removeModel = (index: number) => {
    const newModels = [...uploadedModels];
    newModels.splice(index, 1);
    setUploadedModels(newModels);
    
    toast({
      title: "Modelo removido",
      description: "O modelo foi removido da biblioteca."
    });
  };

  useEffect(() => {
    if (!previewRef.current || !modelParams) return;

    while (previewRef.current.firstChild) {
      previewRef.current.removeChild(previewRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(
      75,
      previewRef.current.clientWidth / previewRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(previewRef.current.clientWidth, previewRef.current.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = modelParams.lightIntensity;
    previewRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

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

    let modelObject: THREE.Object3D;

    if (activeModel === 'diamond') {
      const vertices = [
        0, 2, 0,
        ...Array.from({ length: 18 }, (_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const x = Math.cos(angle) * 1.0;
          const z = Math.sin(angle) * 1.0;
          return [x, 0, z];
        }).flat(),
        0, -2, 0,
      ];
      
      const indices = [];
      for (let i = 1; i < 19; i++) {
        indices.push(0, i, i === 18 ? 1 : i + 1);
      }
      for (let i = 1; i < 19; i++) {
        indices.push(i, 19, i === 18 ? 1 : i + 1);
      }
      
      const geometry = new THREE.PolyhedronGeometry(vertices, indices, 2, 2);
      modelObject = new THREE.Mesh(geometry, material);
    } else if (activeModel === 'sphere') {
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      modelObject = new THREE.Mesh(geometry, material);
    } else if (activeModel === 'torus') {
      const geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 64);
      modelObject = new THREE.Mesh(geometry, material);
    } else {
      const geometry = new THREE.IcosahedronGeometry(2, 1);
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
          
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        
        const distortionFactor = 0.2;
        const noise = Math.sin(vertex.x * 5) * Math.sin(vertex.y * 3) * Math.sin(vertex.z * 7);
        
        vertex.x += noise * distortionFactor;
        vertex.y += noise * distortionFactor;
        vertex.z += noise * distortionFactor;
        
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();
      
      modelObject = new THREE.Mesh(geometry, material);
    }

    modelObject.scale.set(0.7, 0.7, 0.7);
    scene.add(modelObject);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();
    
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x333333);
    
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    cubeCamera.update(renderer, envScene);
    
    const envMap = pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
    scene.environment = envMap;
    pmremGenerator.dispose();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!previewRef.current) return;
      
      const width = previewRef.current.clientWidth;
      const height = previewRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (previewRef.current && previewRef.current.contains(renderer.domElement)) {
        previewRef.current.removeChild(renderer.domElement);
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, [activeModel, modelParams]);

  useEffect(() => {
    const checkForUpdates = () => {
      const savedParams = localStorage.getItem("modelParameters");
      if (savedParams) {
        const newParams = JSON.parse(savedParams);
        setModelParams(newParams);
      }
    };
    
    checkForUpdates();
    
    window.addEventListener('storage', checkForUpdates);
    const interval = setInterval(checkForUpdates, 1000);
    
    return () => {
      window.removeEventListener('storage', checkForUpdates);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileAxis3d className="text-purple-400" size={24} />
          Biblioteca de Modelos 3D
        </h2>
        
        <label htmlFor="model-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
            <Upload size={16} /> Adicionar Modelo
          </div>
          <input
            id="model-upload"
            type="file"
            accept=".gltf,.glb"
            className="hidden"
            onChange={handleModelUpload}
          />
        </label>
      </div>

      <Card className="border-gray-700 bg-black/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full h-64 sm:h-80 bg-gray-800/80 rounded-lg overflow-hidden">
            <div ref={previewRef} className="w-full h-full"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/30 border-gray-700">
        <CardContent className="p-5">
          <h3 className="text-lg font-medium mb-4">Modelo da Página Inicial</h3>
          <p className="text-gray-400 mb-4">Selecione o modelo que será exibido na página inicial:</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            <div 
              className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'diamond' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
              onClick={() => changeActiveModel('diamond')}
            >
              <Diamond size={40} />
              <span>Diamante</span>
              {activeModel === 'diamond' && <Check size={16} className="mt-1" />}
            </div>
            
            <div 
              className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'sphere' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
              onClick={() => changeActiveModel('sphere')}
            >
              <Circle size={40} />
              <span>Esfera</span>
              {activeModel === 'sphere' && <Check size={16} className="mt-1" />}
            </div>
            
            <div 
              className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'torus' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
              onClick={() => changeActiveModel('torus')}
            >
              <CircleDot size={40} />
              <span>Anel</span>
              {activeModel === 'torus' && <Check size={16} className="mt-1" />}
            </div>
            
            <div 
              className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'crystal' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
              onClick={() => changeActiveModel('crystal')}
            >
              <FileAxis3d size={40} />
              <span>Cristal</span>
              {activeModel === 'crystal' && <Check size={16} className="mt-1" />}
            </div>
          </div>
          
          {loadingModels ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : savedModels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {savedModels.map((model) => (
                <div 
                  key={model.id}
                  className={`bg-gray-700/50 p-4 rounded-lg border ${model.is_active ? 'border-purple-500' : 'border-gray-600'} hover:bg-gray-700 transition-colors`}
                >
                  <div className="h-40 mb-3 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                    {model.thumbnail_url ? (
                      <img 
                        src={model.thumbnail_url} 
                        alt={model.name} 
                        className="h-full object-contain" 
                      />
                    ) : (
                      <FileAxis3d size={48} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium text-sm">{model.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{model.model_type}</span>
                      <div className="flex gap-1">
                        {model.is_active ? (
                          <div className="px-2 py-1 bg-purple-600 text-white rounded-md text-xs flex items-center">
                            <Check size={12} className="mr-1" /> Ativo
                          </div>
                        ) : (
                          <button
                            onClick={() => activateModel(model.id, model.model_type)}
                            className="px-2 py-1 bg-gray-600 hover:bg-purple-600 text-white rounded-md text-xs transition-colors"
                          >
                            Ativar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <Folder className="h-12 w-12 mx-auto mb-2 text-gray-500" />
              <p className="text-gray-400">Nenhum modelo salvo no banco de dados</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/30 border-gray-700">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
            <Input
              placeholder="Nome para o próximo modelo..."
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              className="bg-gray-700/50 border-gray-600 flex-1"
            />
            <label htmlFor="quick-model-upload" className="cursor-pointer">
              <div className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                <Plus size={20} />
              </div>
              <input
                id="quick-model-upload"
                type="file"
                accept=".gltf,.glb"
                className="hidden"
                onChange={handleModelUpload}
              />
            </label>
          </div>
          
          <Separator className="my-4 bg-gray-700" />
          
          {uploadedModels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
              <Folder className="mb-3 h-12 w-12 opacity-50" />
              <p className="text-lg">Nenhum modelo 3D adicionado</p>
              <p className="text-sm mt-2 max-w-md">
                Upload modelos GLTF ou GLB para exibir na visualização 3D da página inicial.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedModels.map((model, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <div className="h-40 flex items-center justify-center bg-gray-800 rounded mb-3">
                    {model.preview ? (
                      <img 
                        src={model.preview} 
                        alt={model.name} 
                        className="h-full object-contain" 
                      />
                    ) : (
                      <FileAxis3d size={48} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">{model.name}</h3>
                      <p className="text-xs text-gray-400">{Math.round(model.file.size / 1024)} KB</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeActiveModel('gltf')}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                        title="Usar na página inicial"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => removeModel(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelTab;
