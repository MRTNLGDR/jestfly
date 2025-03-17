
import { useRef, useState } from "react";
import useModelData from "../hooks/useModelData";
import ModelViewer from "../components/home/ModelViewer";
import SketchfabViewer from "../components/home/SketchfabViewer";
import FrontCrystal from "../components/home/FrontCrystal";
import AdminLink from "../components/home/AdminLink";
import TitleOverlay from "../components/home/TitleOverlay";
import SubtitleOverlay from "../components/home/SubtitleOverlay";

const Index = () => {
  const {
    currentModel,
    sketchfabUrl,
    modelParams,
    titleText,
    subtitleText
  } = useModelData();
  
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Cristal flutuante na frente do texto */}
      <FrontCrystal />

      {/* Admin Link */}
      <AdminLink />

      {/* Logo/Title overlay */}
      <TitleOverlay titleText={titleText} />

      {/* Content overlay */}
      <SubtitleOverlay subtitleText={subtitleText} />
      
      {/* Sketchfab container - mostrado apenas quando o modelo for do Sketchfab */}
      {currentModel === 'sketchfab' ? (
        <SketchfabViewer sketchfabUrl={sketchfabUrl} />
      ) : (
        <ModelViewer 
          currentModel={currentModel} 
          modelParams={modelParams} 
        />
      )}
    </div>
  );
};

export default Index;
