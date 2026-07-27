import { CONFIG } from "../../../../../../../../config/config";

import Image from "next/image";

interface ProductOfferProps {
  discountedPrice: number;
  priceUsingCard: number;
}

const ProductOffer = ({
  discountedPrice,
  priceUsingCard,
}: ProductOfferProps) => {
  return (
    <div className="flex justify-between items-end">
      <div className="flex flex-col justify-end">
        <span className="text-xl md:text-lg xl:text-2xl mb-1.5">
          {discountedPrice.toFixed(2).replace(".", ",")} ₽
        </span>
        <span className="text-xs text-[#bfbfbf]">Обычная цена</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-main-text text-2xl xl:text-4xl font-bold">
          {priceUsingCard.toFixed(2).replace(".", ",")} ₽
        </span>
        <div className="flex items-end gap-x-1 relative">
          <span className="text-xs text-[#bfbfbf]">С картой Северяночки</span>
          <div className="group relative">
            <Image
              src="/icons-products/icon-info.svg"
              alt="Дополнительная информация"
              width={24}
              height={24}
              sizes="24px"
              className="relative top-1"
            />
            <div
              className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-white border border-gray-200 
            shadow-lg rounded-md text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity 
            duration-200 pointer-events-none z-50"
            >
              Скидка {CONFIG.CARD_DISCOUNT_PERCENT}% по карте лояльности
              «Северяночка». Оформите карту на кассе или закажите с курьером!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOffer;
