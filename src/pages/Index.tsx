
import { useRef } from "react";
import { useModelSettings } from "@/hooks/useModelSettings";
import CrystalScene from "@/components/crystal/CrystalScene";
import SketchfabScene from "@/components/crystal/SketchfabScene";
import FloatingCrystal from "@/components/crystal/FloatingCrystal";
import TitleOverlay from "@/components/crystal/TitleOverlay";
import SubtitleOverlay from "@/components/crystal/SubtitleOverlay";
import AdminLink from "@/components/crystal/AdminLink";
import LoadingIndicator from "@/components/crystal/LoadingIndicator";
import ErrorDisplay from "@/components/crystal/ErrorDisplay";

const Index = () => {
  const frontCrystalRef = useRef<HTMLDivElement>(null);
  const {
    loadingModel,
    loadingError,
    titleText,
    subtitleText,
    currentModel,
    sketchfabUrl,
    modelParams,
    handleModelLoaded,
    handleModelError
  } = useModelSettings();
  
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Cristal flutuante na frente do texto */}
      <FloatingCrystal />

      {/* Admin Link */}
      <AdminLink />

      {/* Logo/Title overlay */}
      <TitleOverlay titleText={titleText} />

      {/* Content overlay */}
      <SubtitleOverlay subtitleText={subtitleText} />
      
      {/* Loading indicator */}
      <LoadingIndicator isLoading={loadingModel} />
      
      {/* Error message */}
      <ErrorDisplay error={loadingError} />
      
      {/* Sketchfab container - mostrado apenas quando o modelo for do Sketchfab */}
      {currentModel === 'sketchfab' ? (
        <SketchfabScene
          sketchfabUrl={sketchfabUrl}
          onLoaded={handleModelLoaded}
          onError={handleModelError}
        />
      ) : (
        <CrystalScene
          currentModel={currentModel}
          modelParams={modelParams}
          onLoaded={handleModelLoaded}
          onError={handleModelError}
        />
      )}
    </div>
  );
};

export default Index;
