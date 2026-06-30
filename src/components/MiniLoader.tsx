const MiniLoader = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="flex gap-x-2">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "3000ms" }}
        />
      </div>
    </div>
  );
};

export default MiniLoader;
