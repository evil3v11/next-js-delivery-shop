interface LoaderProps {
  text?: string;
  className?: string;
}

const Loader = ({ text = "", className = "" }: LoaderProps) => {
  return (
    <div
      className={` min-h-20 flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className="relative w-12 h-12">
        <div className="w-full h-full border-4 border-orange-500 border-t-transparent 
          rounded-full animate-spin" />
        <div className="w-full h-full border-4 border-orange-500 border-b-transparent 
          rounded-full animate-spin-reverse absolute" />
      </div>
      {text && <p className="text-primary">Загрузка {text}...</p>}
    </div>
  );
};

export default Loader;
