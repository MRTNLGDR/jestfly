
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import { Lightbulb, Sparkles } from "lucide-react";
import { Check } from "lucide-react";
import { ModelParameters } from "@/types/model";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ColorPickerProps {
  isColorPickerOpen: string | null;
  setIsColorPickerOpen: React.Dispatch<React.SetStateAction<string | null>>;
  modelParams: ModelParameters;
  updateModelParam: (param: keyof ModelParameters, value: number | string) => void;
}

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
  // Referência para o container do modelo 3D de prévia
  const previewRef = useRef<HTMLDivElement>(null);

  // UseEffect para renderizar o modelo 3D
  useEffect(() => {
    if (!previewRef.current) return;

    // Limpar qualquer canvas existente
    while (previewRef.current.firstChild) {
      previewRef.current.removeChild(previewRef.current.firstChild);
    }

    // Configurar scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Configurar camera
    const camera = new THREE.PerspectiveCamera(
      75,
      previewRef.current.clientWidth / previewRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Configurar renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(previewRef.current.clientWidth, previewRef.current.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = modelParams.lightIntensity;
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
      iridescenceIOR: modelParams.iridescenceIOR
    });

    // Criar um modelo de cristal distorcido para prévia
    const geometry = new THREE.IcosahedronGeometry(2, 2);
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
    
    const crystal = new THREE.Mesh(geometry, material);
    crystal.scale.set(0.7, 0.7, 0.7);
    scene.add(crystal);

    // Adicionar luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Adicionar luz direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, modelParams.lightIntensity);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Criar environment map simples para reflexões
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();
    
    // Criar um ambiente básico
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x333333);
    
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    cubeCamera.update(renderer, envScene);
    
    const envMap = pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
    scene.environment = envMap;
    pmremGenerator.dispose();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (previewRef.current && previewRef.current.contains(renderer.domElement)) {
        previewRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [modelParams]); // Re-renderizar quando os parâmetros mudarem

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Material e Efeitos Visuais</h2>
        <div className="flex gap-2">
          <Button onClick={resetModelParams} variant="outline">
            Resetar
          </Button>
          <Button onClick={saveModelSettings} className="bg-purple-600 hover:bg-purple-700">
            Salvar Configurações
          </Button>
        </div>
      </div>
      
      {/* Adicionar a área de prévia do modelo */}
      <div className="w-full h-64 bg-gray-800/80 rounded-lg overflow-hidden mb-6">
        <div ref={previewRef} className="w-full h-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: modelParams.color }}></div>
                Cor do Modelo
              </Label>
              <div 
                className="w-8 h-8 rounded cursor-pointer border border-white/20"
                style={{ backgroundColor: modelParams.color }}
                onClick={() => isColorPickerOpen === 'modelColor' 
                  ? setIsColorPickerOpen(null) 
                  : setIsColorPickerOpen('modelColor')}
              />
            </div>
            {isColorPickerOpen === 'modelColor' && (
              <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                <HexColorPicker 
                  color={modelParams.color} 
                  onChange={(color) => updateModelParam('color', color)} 
                />
                <div className="mt-2 flex gap-2">
                  <Input 
                    value={modelParams.color} 
                    onChange={(e) => updateModelParam('color', e.target.value)}
                    className="bg-gray-800 border-gray-600"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => setIsColorPickerOpen(null)}
                    className="bg-gray-600 hover:bg-gray-500"
                  >
                    <Check size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label className="flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" />
                Intensidade da Luz
              </Label>
              <span className="text-sm text-gray-400">{modelParams.lightIntensity.toFixed(2)}</span>
            </div>
            <Slider 
              min={0.1} 
              max={5} 
              step={0.1} 
              value={[modelParams.lightIntensity]} 
              onValueChange={(values) => updateModelParam('lightIntensity', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Metalicidade</Label>
              <span className="text-sm text-gray-400">{modelParams.metalness.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.metalness]} 
              onValueChange={(values) => updateModelParam('metalness', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Rugosidade</Label>
              <span className="text-sm text-gray-400">{modelParams.roughness.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.roughness]} 
              onValueChange={(values) => updateModelParam('roughness', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Transmissão</Label>
              <span className="text-sm text-gray-400">{modelParams.transmission.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.transmission]} 
              onValueChange={(values) => updateModelParam('transmission', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Espessura</Label>
              <span className="text-sm text-gray-400">{modelParams.thickness.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={5} 
              step={0.1} 
              value={[modelParams.thickness]} 
              onValueChange={(values) => updateModelParam('thickness', values[0])}
              className="my-4"
            />
          </div>
        </div>
        
        <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                Intensidade do Mapa Env
              </Label>
              <span className="text-sm text-gray-400">{modelParams.envMapIntensity.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={5} 
              step={0.1} 
              value={[modelParams.envMapIntensity]} 
              onValueChange={(values) => updateModelParam('envMapIntensity', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Camada Clara</Label>
              <span className="text-sm text-gray-400">{modelParams.clearcoat.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.clearcoat]} 
              onValueChange={(values) => updateModelParam('clearcoat', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Rugosidade da Camada Clara</Label>
              <span className="text-sm text-gray-400">{modelParams.clearcoatRoughness.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.clearcoatRoughness]} 
              onValueChange={(values) => updateModelParam('clearcoatRoughness', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Índice de Refração (IOR)</Label>
              <span className="text-sm text-gray-400">{modelParams.ior.toFixed(2)}</span>
            </div>
            <Slider 
              min={1} 
              max={3.5} 
              step={0.01} 
              value={[modelParams.ior]} 
              onValueChange={(values) => updateModelParam('ior', values[0])}
              className="my-4"
            />
            <p className="text-xs text-gray-400">
              Referência: Vidro (1.5), Diamante (2.4), Água (1.3)
            </p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Refletividade</Label>
              <span className="text-sm text-gray-400">{modelParams.reflectivity.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.reflectivity]} 
              onValueChange={(values) => updateModelParam('reflectivity', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Efeito Iridescente</Label>
              <span className="text-sm text-gray-400">{modelParams.iridescence.toFixed(2)}</span>
            </div>
            <Slider 
              min={0} 
              max={1} 
              step={0.01} 
              value={[modelParams.iridescence]} 
              onValueChange={(values) => updateModelParam('iridescence', values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>IOR Iridescente</Label>
              <span className="text-sm text-gray-400">{modelParams.iridescenceIOR.toFixed(2)}</span>
            </div>
            <Slider 
              min={1} 
              max={2.5} 
              step={0.01} 
              value={[modelParams.iridescenceIOR]} 
              onValueChange={(values) => updateModelParam('iridescenceIOR', values[0])}
              className="my-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
