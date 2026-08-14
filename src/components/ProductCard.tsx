import { ProductCardProps } from "@/types/product";

import { CONFIG } from "../../config/config";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "@/utils/calculateProductPrice";
import { formatPrice } from "@/utils/formatPrice";

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import AddToFavoritesButton from "./AddToFavoritesButton";
import AddToCartButton from "./AddToCartButton";
import IconCart from "./svg/IconCart";
import { TRANSLATIONS } from "@/utils/translations";

interface ExtendedProductCardProps extends ProductCardProps {
  isOrderCard?: boolean;
  index?: number;
  isAdminOrderPage?: boolean;
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
  index = 0,
  isAdminOrderPage = false,
}: Omit<ExtendedProductCardProps, "volume" | "hasNoCard">) => {
  const finalPrice = calculateFinalPrice(basePrice, discountPercent);
  const priceByCard = calculatePriceByCard(
    finalPrice,
    CONFIG.CARD_DISCOUNT_PERCENT,
  );

  const showTwoPrices =
    !isOrderCard && discountPercent > 0 && CONFIG.CARD_DISCOUNT_PERCENT > 0;
  const displayPrice = showTwoPrices ? priceByCard : finalPrice;

  const ratingValue = rating?.rate || 5.0;

  const productUrl = `/catalog/${encodeURIComponent(categories?.[0])}/${id}}`;

  const isPriorityImage = index < 4;

  return (
    <div
      className={`flex flex-col justify-between w-40 rounded overflow-hidden bg-white
        md:w-56 xl:w-68 ${isAdminOrderPage ? "h-auto" : "h-87.25"}  align-top p-1 hover:shadow-article 
        duration-300 hover:scale-105 relative`}
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
            ${
              isInsufficientStock
                ? "bg-[#d80000] text-white"
                : "bg-secondary text-white"
            }`}
        >
          {isInsufficientStock ? "Нет в наличии" : `Осталось: ${quantity}`}
        </div>
      )}
      {!isAdminOrderPage && <AddToFavoritesButton productId={String(id)} />}
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
          {!isAdminOrderPage && !isOrderCard && discountPercent > 0 && (
            <div className="absolute bg-secondary px-3 py-1 rounded text-white bottom-2.5 left-2.5">
              -{discountPercent}%
            </div>
          )}
        </div>
        <div
          className={`flex flex-col p-2 ${isAdminOrderPage ? "h-auto" : "h-47.25"}`}
        >
          {!isAdminOrderPage && (
            <div className="flex flex-row justify-between items-center h-12.25">
              <div className="flex flex-col gap-x-1">
                <div className="flex flex-row gap-x-1 text-sm md:text-lg font-bold text-main-text">
                  <span>{formatPrice(displayPrice)}</span>
                  <span>₽</span>
                </div>
                {showTwoPrices && (
                  <p className="text-[#bfbfbf] text-[8px] md:text-xs">
                    С картой
                  </p>
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
          )}
          {isAdminOrderPage && (
            <div className="text-xs mb-2">{TRANSLATIONS[categories[0]]}</div>
          )}
          <div className="h-13.5 text-xs md:text-base text-main-text line-clamp-3 md:line-clamp-2">
            {description}
          </div>
          {!isAdminOrderPage && <StarRating rating={ratingValue} />}
        </div>
      </Link>
      {!isAdminOrderPage && (
        <AddToCartButton
          productId={String(id)}
          availableQuantity={quantity}
          variant="onProductCard"
        />
      )}
    </div>
  );
};

export default ProductCard;
