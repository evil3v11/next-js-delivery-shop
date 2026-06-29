import Image from "next/image";

import iconHeart from "../../public/icons-header/icon-heart.svg";

import { ProductCardProps } from "@/types/product";
import StarRating from "./StarRating";
import Link from "next/link";

const ProductCard = ({
  _id,
  img,
  description,
  basePrice,
  discountPercent = 0,
  rating,
  tags,
}: ProductCardProps) => {
  const cardDiscountPercent = 6;
  const calculateFinalPrice = (price: number, discount: number): number => {
    return discount ? price * (1 - discount / 100) : price;
  };

  const calculatePriceByCard = (price: number, discount: number): number => {
    return calculateFinalPrice(price, discount);
  };

  const isNewProduct = tags?.includes("new");

  const finalPrice = isNewProduct
    ? basePrice
    : calculatePriceByCard(basePrice, discountPercent);

  const priceByCard = isNewProduct
    ? basePrice
    : calculatePriceByCard(finalPrice, cardDiscountPercent);

  const formatPrice = (price: number): string =>
    price.toFixed(2).replace(".", ",");

  const ratingValue = rating?.rate || 5;

  return (
    <div
      className="flex flex-col justify-between w-40 rounded overflow-hidden bg-white
        md:w-56 xl:w-68 р-[349px] align-top p-1 hover:shadow-article duration-300 
        hover:scale-105 relative"
    >
      <button
        className="w-8 h-8 p-2 bg-[#f3f2f1] hover:bg-[#fcd5ba] absolute top-2
        right-2 opacity-50 rounded cursor-pointer duration-300 z-10"
      >
        <Image
          src={iconHeart}
          alt="В избранное"
          width={24}
          height={24}
          sizes="24px"
        />
      </button>
      <Link href={`/product/${_id}`}>
        <div className="relative w-40 h-40 md:w-56 xl:w-68">
          <Image
            src={img}
            alt="Акция"
            fill
            priority={false}
            className="object-contain cursor-pointer hover:scale-110 duration-300"
            sizes="(max-width: 768px) 160px, (max-width: 1200px) 224px, 272px"
          />
          {discountPercent > 0 && (
            <div className="absolute bg-[#FF6633] px-3 py-1 rounded text-white bottom-2.5 left-2.5">
              -{discountPercent}%
            </div>
          )}
        </div>

        <div className="flex flex-col p-2 h-[189px]">
          <div className="flex flex-row justify-between items-cen h-[49px]">
            <div className="flex flex-col gap-x-1">
              <div className="flex flex-row gap-x-1 text-sm md:text-lg font-bold text-[#414141]">
                <span>{formatPrice(priceByCard)}</span>
                <span>₽</span>
              </div>
              {discountPercent > 0 && (
                <p className="text-[#bfbfbf] text-[8px] md:text-xs">С картой</p>
              )}
            </div>

            {finalPrice !== basePrice && (
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
            className="h-13.5 text-xs md:text-base text-[#414141] line-clamp-3
        md:line-clamp-2"
          >
            {description}
          </div>
          {ratingValue > 0 && <StarRating rating={ratingValue} />}
        </div>
      </Link>
      <button
        className="absolute border bottom-2 left-2 right-2 border-primary hover:text-white hover:bg-[#ff6633]
        hover:border-transparent active:shadow-button-active h-10 rounded p-2
        justify-center items-center text-primary transition-all duration-300 cursor-pointer
        select-none"
      >
        В корзину
      </button>
    </div>
  );
};

export default ProductCard;
