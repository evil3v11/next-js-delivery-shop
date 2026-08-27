interface CurrentColorShowcaseProps {
  type: "text" | "bg";
  currentColor: string;
}

const CurrentColorShowcase = ({
  type,
  currentColor,
}: CurrentColorShowcaseProps) => {
  const style = type === "text"
    ? { backgroundColor: currentColor }
    : { backgroundColor: currentColor === "transparent" ? "#fff" : currentColor,
        backgroundSize: currentColor === "transparent" ? "8px 8px" : "auto",
        backgroundImage: currentColor === "transparent"
          ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
          : "none",
      };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-3">
      <div className="text-sm text-gray-600">Текущий:</div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-gray-300" style={style} />
        <span className="text-sm font-mono">
          {currentColor === "#000000" ? "По умолчанию" : currentColor}
        </span>
      </div>
    </div>
  );
};

export default CurrentColorShowcase;
