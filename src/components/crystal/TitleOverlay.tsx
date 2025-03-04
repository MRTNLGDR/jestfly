
interface TitleOverlayProps {
  titleText: string;
}

const TitleOverlay: React.FC<TitleOverlayProps> = ({ titleText }) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <h1 className="text-7xl sm:text-9xl md:text-[12rem] font-bold tracking-tighter text-red-600 leading-none opacity-90">
        {titleText}
      </h1>
    </div>
  );
};

export default TitleOverlay;
