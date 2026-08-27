const ResetColorButton = ({ resetColor }: { resetColor: () => void }) => {
  return (
    <button
      type="button"
      onClick={resetColor}
      className="w-full px-3 py-1.5 text-sm rounded duration-300 cursor-pointer bg-red-50 text-red-700 
      border border-red-200 hover:bg-red-100 hover:border-red-300"
    >
      Сбросить цвет
    </button>
  );
};

export default ResetColorButton;
