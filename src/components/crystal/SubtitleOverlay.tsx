
interface SubtitleOverlayProps {
  subtitleText: string;
}

const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({ subtitleText }) => {
  // Converter quebras de linha no subtítulo
  const formattedSubtitle = subtitleText.split('\n').map((text, i) => (
    <p key={i} className="text-sm uppercase tracking-widest opacity-80">
      {text}
    </p>
  ));
  
  return (
    <div className="absolute left-4 sm:left-16 bottom-16 sm:bottom-32 z-20 max-w-xs text-left text-white">
      <div className="animate-fade-in space-y-2">
        {formattedSubtitle}
      </div>
    </div>
  );
};

export default SubtitleOverlay;
