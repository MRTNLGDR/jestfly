
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  RotateCcw, 
  Save, 
  RefreshCcw, 
  FileAxis3d,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelParameters } from "@/types/model";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Switch } from "@/components/ui/switch";

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
  const [activeTab, setActiveTab] = useState("appearance");
  const [previewType, setPreviewType] = useState<"sphere" | "box" | "torus" | "crystal">("sphere");
  const [showWireframe, setShowWireframe] = useState(false);

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
      iridescenceIOR: modelParams.iridescenceIOR,
      wireframe: showWireframe
    });

    // Criar wireframe adicional quando necessário
    let wireframeMesh: THREE.Mesh | null = null;

    // Criar modelo com base no tipo selecionado
    let geometry: THREE.BufferGeometry;
    
    if (previewType === "sphere") {
      geometry = new THREE.SphereGeometry(2, 64, 64);
    } else if (previewType === "box") {
      geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5, 2, 2, 2);
    } else if (previewType === "torus") {
      geometry = new THREE.TorusGeometry(1.5, 0.6, 16, 100);
    } else {
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
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Criar wireframe adicional se não estiver usando o wireframe do material
    if (!showWireframe) {
      const wireframeGeometry = new THREE.WireframeGeometry(geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
      });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      wireframeMesh = wireframe;
      scene.add(wireframe);
    }

    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Adicionar uma segunda luz para melhorar o visual
    const secondaryLight = new THREE.DirectionalLight(0x8080ff, 0.5);
    secondaryLight.position.set(-5, -5, -5);
    scene.add(secondaryLight);

    // Criar ambiente com HDRI básico
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();
    
    // Criar uma cena de ambiente com gradiente
    const envScene = new THREE.Scene();
    
    // Gradiente vertical para o fundo
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#202060');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 2, 512);
      
      const gradientTexture = new THREE.CanvasTexture(canvas);
      
      const sphereMaterial = new THREE.MeshBasicMaterial({
        map: gradientTexture,
        side: THREE.BackSide
      });
      
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(10, 32, 32),
        sphereMaterial
      );
      
      envScene.add(sphere);
    }
    
    // Capturar ambiente
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512);
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
    cubeCamera.update(renderer, envScene);
    
    // Aplicar o ambiente ao material
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
    };
  }, [modelParams, previewType, showWireframe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileAxis3d className="text-purple-400" size={24} />
          Material & Efeitos
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview do Material */}
        <div className="lg:order-2">
          <Card className="bg-gray-800/30 border-gray-700 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Prévia do Material</span>
                <div className="flex gap-2 items-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 px-2 text-xs"
                    onClick={() => setShowWireframe(!showWireframe)}
                  >
                    {showWireframe ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                    {showWireframe ? "Ocultar Wireframe" : "Mostrar Wireframe"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="w-full h-80 bg-gray-900/90 rounded-md">
                <div ref={previewRef} className="w-full h-full"></div>
              </div>
              
              {/* Seletores de forma para a prévia */}
              <div className="absolute left-3 top-3 z-10">
                <div className="bg-black/60 p-1 rounded-md border border-gray-700">
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setPreviewType("sphere")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "sphere" ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                      title="Esfera"
                    >
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </button>
                    <button 
                      onClick={() => setPreviewType("box")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "box" ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                      title="Cubo"
                    >
                      <div className="w-4 h-4 bg-white"></div>
                    </button>
                    <button 
                      onClick={() => setPreviewType("torus")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "torus" ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                      title="Torus"
                    >
                      <div className="w-5 h-3 border-2 border-white rounded-full"></div>
                    </button>
                    <button 
                      onClick={() => setPreviewType("crystal")}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm ${previewType === "crystal" ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                      title="Cristal"
                    >
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-white transform rotate-180"></div>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles do Material */}
        <div className="lg:order-1">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Parâmetros do Material</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs sm:text-sm"
                    onClick={resetModelParams}
                  >
                    <RotateCcw size={14} className="mr-1" />
                    Resetar
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700"
                    onClick={saveModelSettings}
                  >
                    <Save size={14} className="mr-1" />
                    Salvar
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Ajuste os parâmetros para personalizar a aparência do modelo 3D
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="appearance" className="text-xs sm:text-sm data-[state=active]:bg-purple-600">
                    Aparência
                  </TabsTrigger>
                  <TabsTrigger value="transparency" className="text-xs sm:text-sm data-[state=active]:bg-purple-600">
                    Transparência
                  </TabsTrigger>
                  <TabsTrigger value="effects" className="text-xs sm:text-sm data-[state=active]:bg-purple-600">
                    Efeitos
                  </TabsTrigger>
                </TabsList>
                
                {/* Tab Aparência */}
                <TabsContent value="appearance" className="space-y-4">
                  <div className="space-y-4">
                    {/* Seletor de Cor */}
                    <div className="space-y-2">
                      <Label className="text-sm">Cor do Material</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-12 h-12 rounded-md cursor-pointer border border-gray-600"
                          style={{ backgroundColor: modelParams.color }}
                          onClick={() => setIsColorPickerOpen(isColorPickerOpen === "material" ? null : "material")}
                        ></div>
                        <Input 
                          value={modelParams.color} 
                          onChange={(e) => updateModelParam("color", e.target.value)}
                          className="bg-gray-900/60 border-gray-700"
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
                              className="absolute top-2 right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white"
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
                        <Label className="text-sm">Metalicidade</Label>
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
                        <Label className="text-sm">Rugosidade</Label>
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
                        <Label className="text-sm">Intensidade do Ambiente</Label>
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
                    
                    {/* Light Intensity Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm">Intensidade da Luz</Label>
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
                  </div>
                </TabsContent>
                
                {/* Tab Transparência */}
                <TabsContent value="transparency" className="space-y-4">
                  <div className="space-y-4">
                    {/* Transmission Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm">Transparência</Label>
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
                        <Label className="text-sm">Espessura</Label>
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
                        <Label className="text-sm">Índice de Refração (IOR)</Label>
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
                        <Label className="text-sm">Refletividade</Label>
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
                
                {/* Tab Efeitos */}
                <TabsContent value="effects" className="space-y-4">
                  <div className="space-y-4">
                    {/* Clearcoat Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm">Clearcoat</Label>
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
                        <Label className="text-sm">Rugosidade do Clearcoat</Label>
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
                    
                    {/* Iridescence Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm">Iridescência</Label>
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
                        <Label className="text-sm">IOR da Iridescência</Label>
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
              <div className="w-full bg-purple-900/20 rounded-md p-3 text-sm text-purple-300 border border-purple-700/30">
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
