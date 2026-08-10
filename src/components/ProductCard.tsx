import { ProductCardProps } from "@/types/product";

import { CONFIG } from "../../config/config";
import { calculateFinalPrice, calculatePriceByCard } from "@/utils/calculateProductPrice";
import { formatPrice } from "@/utils/formatPrice";

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import AddToFavoritesButton from "./AddToFavoritesButton";
import AddToCartButton from "./AddToCartButton";
import IconCart from "./svg/IconCart";

interface ExtendedProductCardProps extends ProductCardProps {
  isOrderCard?: boolean,
  index?: number
}

const ProductCard = ({
  id,
  img,
  description,
  basePrice,
  discountPercent = 0,
  rating,
  categories,
  quantity,
  orderQuantity,
  isLowStock,
  isInsufficientStock,
  isOrderCard = false,
  index = 0
}: ExtendedProductCardProps) => {
  const finalPrice = calculateFinalPrice(basePrice, discountPercent);
  const priceByCard = calculatePriceByCard(
    finalPrice,
    CONFIG.CARD_DISCOUNT_PERCENT,
  );

  const showTwoPrices = !isOrderCard && discountPercent > 0 && CONFIG.CARD_DISCOUNT_PERCENT > 0;
  const displayPrice = showTwoPrices ? priceByCard : finalPrice;

  const ratingValue = rating?.rate || 5.0;

  const productUrl = `
    /catalog/${encodeURIComponent(categories?.[0])}/${id}?desc=${encodeURIComponent(description.substring(0, 50))}
  `;

  const isPriorityImage = index < 4
  
  return (
    <div
      className="flex flex-col justify-between w-40 rounded overflow-hidden bg-white
        md:w-56 xl:w-68 h-87.25 align-top p-1 hover:shadow-article duration-300 
        hover:scale-105 relative"
    >
      {orderQuantity && (
        <div
          className="absolute top-2 left-2 text-main-text flex items-center p-1 bg-transparent/80 
        rounded justify-center gap-1 text-lg font-bold z-10"
        >
          <IconCart />
          {orderQuantity}
        </div>
      )}
      {(isLowStock || isInsufficientStock) && (
        <div
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 p-1 rounded text-[8px] md:px-2 md:text-xs z-10 
            ${isInsufficientStock
              ? "bg-[#d80000] text-white"
              : "bg-secondary text-white"
          }`}
        >
          {isInsufficientStock ? "Нет в наличии" : `Осталось: ${quantity}`}
        </div>
      )}
      <AddToFavoritesButton productId={String(id)} />
      <Link href={productUrl}>
        <div className="relative w-40 h-40 md:w-56 xl:w-68">
          <Image
            src={img}
            alt="Товар"
            fill
            priority={isPriorityImage}
            className="object-contain cursor-pointer hover:scale-110 duration-300"
            sizes="(max-width: 768px) 160px, (max-width: 1200px) 224px, 272px"
          />
          {!isOrderCard && discountPercent > 0 && (
            <div className="absolute bg-secondary px-3 py-1 rounded text-white bottom-2.5 left-2.5">
              -{discountPercent}%
            </div>
          )}
        </div>
        <div className="flex flex-col p-2 h-47.25">
          <div className="flex flex-row justify-between items-cen h-12.25">
            <div className="flex flex-col gap-x-1">
              <div className="flex flex-row gap-x-1 text-sm md:text-lg font-bold text-main-text">
                <span>{formatPrice(displayPrice)}</span>
                <span>₽</span>
              </div>
              {showTwoPrices && (
                <p className="text-[#bfbfbf] text-[8px] md:text-xs">С картой</p>
              )}
            </div>
            {showTwoPrices && (
              <div className="flex flex-col gap-x-1">
                <div className="flex flex-row gap-x-1 text-sm md:text-base text-[#606060]">
                  <span>{formatPrice(finalPrice)}</span>
                  <span>₽</span>
                </div>
                <p className="text-[#bfbfbf] text-[8px] md:text-xs text-right">
                  Обычная
                </p>
              </div>
            )}
          </div>
          <div
            className="h-13.5 text-xs md:text-base text-main-text line-clamp-3
        md:line-clamp-2"
          >
            {description}
          </div>
          <StarRating rating={ratingValue} />
        </div>
      </Link>
      <AddToCartButton
        productId={String(id)}
        availableQuantity={quantity}
        variant="onProductCard"
      />
    </div>
  );
};

export default ProductCard;
