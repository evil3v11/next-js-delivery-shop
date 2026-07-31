import { memo } from "react";

interface QuantitySelectorProps {
  quantity: number;
  isUpdating: boolean;
  isOutOfStock: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  variant: string;
}

const QuantitySelector = memo(function QuantitySelector({
  quantity,
  isUpdating,
  isOutOfStock,
  onDecrement,
  onIncrement,
  variant,
}: QuantitySelectorProps) {
  const onProductCard = variant === "onProductCard";
  const onProductPage = variant === "onProductPage";

  return (
    <div
      className={`flex items-center gap-2 bg-primary  p-2 rounded text-white relative
    ${onProductCard ? "w-full justify-between h-10" : "w-25 h-10"}
    ${onProductPage ? "w-full justify-between h-16" : "w-25 h-10"}`}
    >
      <button
        onClick={onDecrement}
        disabled={quantity < 0 || isUpdating || isOutOfStock}
        className="w-6 h-6 rounded flex items-center justify-center duration-300 cursor-pointer disabled:opacity-50"
      >
        <div className="w-3.75 h-px bg-white"></div>
      </button>
      <span className="w-12 text-center text-base">
        {isUpdating ? "..." : quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={isUpdating || isOutOfStock}
        className="w-6 h-6 rounded flex items-center justify-center duration-300 cursor-pointer disabled:opacity-50"
      >
        <div className="relative w-3.75 h-3.75">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-white transform -translate-x-1/2" />
        </div>
      </button>
    </div>
  );
});

export default QuantitySelector;
