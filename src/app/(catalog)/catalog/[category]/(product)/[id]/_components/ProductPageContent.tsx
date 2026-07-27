import { ProductCardProps } from "@/types/product";

import { CONFIG } from "../../../../../../../../config/config";
import { getReviewsWord } from "@/utils/getReviewsWord";

import Image from "next/image";
import StarRating from "@/components/StarRating";
import ShareButton from "./ShareButton";
import ImagesBlock from "./ImagesBlock";
import ProductOffer from "./ProductOffer";
import CartButton from "./CartButton";
import Bonuses from "./Bonuses";
import DiscountMessage from "./DiscountMessage";
import AdditionalProductInfo from "./AdditionalProductInfo";
import SimilarProducts from "./SimilarProducts";
import SameBrandProducts from "./SameBrandProducts";
import RatingDistribution from "./RatingDistribution";
import ReviewWrapper from "./ReviewWrapper";
import Promotions from "@/app/(products)/Promotions";

const ProductPageContent = ({ product }: { product: ProductCardProps }) => {
  const discountedPrice = product.discountPercent
    ? product.basePrice * (1 - product.discountPercent / 100)
    : product.basePrice;

  const priceUsingCard =
    discountedPrice * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100);
  const bonuses = priceUsingCard & 0.05;

  return (
    <div
      className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] 
    text-main-text flex flex-col gap-y-20 pb-10"
    >
      <div>
        <h1 className="text-2xl font-bold mb-4">{product.description}</h1>
        <div className="flex flex-col gap-y-25 md:gap-y-20 xl:gap-y-30">
          <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-6">
            <div className="text-xs">арт. {product.article}</div>
            <div className="flex flex-wrap gap-2 items-center">
              <StarRating rating={product.rating.average || 5} />
              <p className="text-sm underline">
                {product.rating.count || 0}{" "}
                {getReviewsWord(product.rating.count || 0)}
              </p>
            </div>
            <ShareButton title={product.title} className="" />
            <button className="flex gap-2 items-center cursor-pointer">
              <Image
                src="/icons-header/icon-heart.svg"
                alt="Добавить в избранное"
                width={24}
                height={24}
                sizes="24px"
                className="select-none"
              />
              <p className="text-sm">В избранное</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 w-full justify-center">
          <ImagesBlock product={product} />
          <div className="md:w-86 flex flex-col gap-y-5">
            <ProductOffer
              discountedPrice={discountedPrice}
              priceUsingCard={priceUsingCard}
            />
            <CartButton />
            <Bonuses bonus={bonuses} />
            <DiscountMessage
              productId={String(product.id)}
              productTitle={product.title}
              currentPrice={String(product.basePrice)}
            />
            <AdditionalProductInfo
              brand={product.brand}
              manufacturer={product.manufacturer}
              weight={Number(product.weight)}
            />
          </div>
          <SimilarProducts currentProduct={product} />
        </div>
      </div>
      <SameBrandProducts currentProduct={product} />
      <div className="flex flex-col">
        <h2 className="text-2xl xl:text-4xl text-left font-bold mb-4 md:mb-8 xl:mb-10 px-[max(12px,calc((100%-1208px)/2))]">
          Отзывы
        </h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-x-8 xl:gap-x-36">
          <RatingDistribution
            averageRating={product.rating.rate}
            distribution={product.rating.distribution}
          />
          <ReviewWrapper productId={product.id} />
        </div>
      </div>
      <Promotions randomLimit={6} mobileItemsLimit={6} />
    </div>
  );
};

export default ProductPageContent;
