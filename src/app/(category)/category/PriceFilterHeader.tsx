"use client";

const PriceFilterHeader = ({
  onResetAction,
}: {
  onResetAction: () => void;
}) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-black text-base">Цена</p>
      <button
        type="button"
        onClick={onResetAction}
        className="text-xs rounded bg-[#f3f2f1] h-8 p-2 cursor-pointer hover:bg-primary
            hover:shadow-button-default active:shadow-button-active hover:text-white 
            duration-300"
      >
        Очистить
      </button>
    </div>
  );
};

export default PriceFilterHeader;
