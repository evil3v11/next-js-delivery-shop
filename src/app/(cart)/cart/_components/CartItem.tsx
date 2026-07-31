"use client";

import { useState, memo } from "react";

import { CartItemProps } from "@/types/cart";

import { CONFIG } from "../../../../../config/config";
import { formatPrice } from "@/utils/formatPrice";
import { calculateFinalPrice, calculatePriceByCard } from "@/utils/calculateProductPrice";

import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import CartSkeleton from "./CartSkeleton";
import SelectCheckbox from "./SelectCheckbox";
import ProductImage from "./ProductImage";
import PriceDisplay from "./PriceDisplay";
import DiscountBadge from "./DiscountBadge";
import QuantitySelector from "./QuantitySelector";

const CartItem = memo(function CartItem({
  item,
  productData,
  isSelected,
  onSelectionChange,
  onQuantityUpdate,
  hasLoyaltyCard,
}: CartItemProps) {
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleQuantityChange = async (newQuantity: number): Promise<void> => {
    if (newQuantity <= 0) return;
    if (!productData) return;

    const maxQuantity = productData.quantity;
    if (newQuantity > maxQuantity) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    const prevQuantity = quantity;
    try {
      setIsUpdating(true);
      setQuantity(newQuantity);
      onQuantityUpdate(item.productId, newQuantity);
    } catch (e) {
      console.error("Ошибка при обновлении количества товара: ", e);
      setQuantity(prevQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const discountedPrice = calculateFinalPrice(productData.basePrice || 0, productData.discountPercent || 0);
  const finalPrice = hasLoyaltyCard
    ? calculatePriceByCard(discountedPrice, CONFIG.CARD_DISCOUNT_PERCENT)
    : discountedPrice;

  const totalFinalPrice = finalPrice * quantity;
  const totalPriceWithoutCard = discountedPrice * quantity;
  const isOutOfStock = !productData.quantity;
  const hasDiscount = productData ? productData.discountPercent > 0 : false;

  if (!productData) return <CartSkeleton />;

  return (
    <div
      className={`
        bg-white rounded flex shadow-cart-item hover:shadow-article relative duration-300
        ${isOutOfStock ? "opacity-60" : ""}
      `}
    >
      <SelectCheckbox
        isSelected={isSelected}
        onSelectionChange={(checked: boolean) => onSelectionChange(item.productId, checked)}
      />
      <div className="flex flex-wrap md:flex-row justify-between w-full md:flex-nowrap">
        <div className="flex gap-x-2 flex-wrap md:flex-nowrap">
          <ProductImage productId={item.productId} title={productData.title} />
          <div className="flex-1 flex min-w-56 md:flex-initial flex-col gap-y-2.5 p-2.5">
            <Link
              className="text-base hover:text-secondary cursor-pointer max-w-127.5"
              href={`/catalog/${productData.categories[0]}/${item.productId}?desc=${productData.description}`}
            >
              {productData.description}
            </Link>
            <div className="flex gap-x-2 items-center justify-between md:justify-start">
              <PriceDisplay
                finalPrice={finalPrice}
                priceWithDiscount={discountedPrice}
                hasDiscount={hasDiscount}
                isOutOfStock={isOutOfStock}
              />
              {hasDiscount && <DiscountBadge discountPercent={productData.discountPercent} />}
            </div>
          </div>
        </div>
        {showTooltip && <Tooltip text="Количество ограничено" position="top" />}
        <div
          className="flex flex-wrap justify-between items-center gap-2 w-full md:w-30 xl:w-59 p-2 md:flex-nowrap 
        md:flex-col md:justify-center md:items-end xl:flex-row xl:items-center xl:justify-end"
        >
          {!isOutOfStock && (
            <QuantitySelector
              quantity={quantity}
              isUpdating={isUpdating}
              isOutOfStock={isOutOfStock}
              onDecrement={() => handleQuantityChange(quantity - 1)}
              onIncrement={() => handleQuantityChange(quantity + 1)}
            />
          )}
          <div
            className={`text-sm md:text-lg font-bold text-right w-fit md:w-full flex
            ${isOutOfStock ? "justify-end" : "justify-center"}`}
          >
            {isOutOfStock ? (
              <span className="font-normal md:text-base flex">
                Нет в наличии
              </span>
            ) : (
              <span className="w-full">
                <p className="text-right md:text-center">{formatPrice(totalFinalPrice)} ₽</p>
                {hasDiscount && (
                  <div className="flex gap-x-2 md:hidden ">
                    <p className="line-through font-normal text-xs md:text-base text-[#8f8f8f] w-fit">
                      {formatPrice(totalPriceWithoutCard)} ₽
                    </p>
                    <p className="font-normal text-xs text-secondary  w-fit">
                      {formatPrice(totalFinalPrice - totalPriceWithoutCard)} ₽
                    </p>
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
