"use client";

import { useAddToCart } from "@/hooks/useAddToCart";

import QuantitySelector from "@/app/(cart)/cart/_components/QuantitySelector";
import Image from "next/image";
import Tooltip from "./Tooltip";

interface AddToCartButtonProps {
  productId: string;
  availableQuantity: number;
  variant: string;
}

const AddToCartButton = ({
  productId,
  availableQuantity,
  variant,
}: AddToCartButtonProps) => {
  const {
    tooltipMessage,
    isAdding,
    displayQuantity,
    isInCart,
    hasReachedMaxQuantity,
    isOutOfStock,
    showTooltip,
    addToCart,
    incrementQuantity,
    decrementQuantity,
  } = useAddToCart(productId, availableQuantity);

  const onProductPage = variant === "onProductPage";

  const getAddToCartButtonText = (): string => {
    if (isOutOfStock) return "Нет в наличии";
    if (isAdding) return "...";
    return "В корзину";
  };

  return (
    <div className="relative">
      {showTooltip && <Tooltip text={tooltipMessage} position="top" cardPosition={true} />}
      {isInCart && !isOutOfStock ? (
        <div
          className={`flex justify-center  
        ${onProductPage ? "w-full h-auto" : "absolute left-2 bottom-2 right-2"}`}
        >
          <QuantitySelector
            quantity={displayQuantity}
            isUpdating={isAdding}
            isOutOfStock={isOutOfStock}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            variant={variant}
          />
        </div>
      ) : (
        <button
          onClick={addToCart}
          disabled={isOutOfStock || isAdding || hasReachedMaxQuantity}
          className={
            onProductPage
              ? "w-full bg-secondary text-white text-xl md:text-2xl p-4 flex justify-between items-center rounded cursor-pointer shadow-button-default hover:shadow-button-secondary active:shadow-button-activehover:bg-secondary/80 duration-300"
              : "absolute border bottom-2 left-2 right-2 border-primary hover:text-white hover:bg-secondary hover:border-transparent active:shadow-button-active h-10 rounded p-2justify-center items-center text-primary transition-all duration-300 cursor-pointer select-none"
          }
        >
          {isAdding ? (
            <span className="flex-1 self-center">Добавляем...</span>
          ) : (
            <>
              {onProductPage && (
                <Image
                  src="/icons-products/icon-shopping-cart.svg"
                  alt="Добавить в корзину"
                  width={32}
                  height={32}
                  sizes="32px"
                />
              )}
              <span className="flex-1 self-center">
                {getAddToCartButtonText()}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
