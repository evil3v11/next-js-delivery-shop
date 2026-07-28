import { ProductCardProps } from "@/types/product";

import Image from "next/image";
import Link from "next/link";

const SimilarProducts = async ({
  currentProduct,
}: {
  currentProduct: ProductCardProps;
}) => {
  const category = currentProduct.categories[0];
  if (!category) return null;

  let similarProducts: ProductCardProps[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/similar-products?productId=${currentProduct.id}&category=${category}&limit=4`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error("Не удалось получить похожие продукты");

    similarProducts = await response.json();
    if (similarProducts.length === 0) return null;
  } catch (e) {
    console.error(e instanceof Error ? e.message : "Неизвестная ошибка");
  }

  const calculatePrice = (product: ProductCardProps): number => {
    const discount = product.basePrice * (product.discountPercent / 100);
    return Math.round(product.basePrice - discount);
  };

  return (
    <div className="mx-auto flex flex-col items-center">
      <div className="w-full max-w-82 md:max-w-172 xl:max-w-42">
        <h3 className="text-sm md:text-lg font-semibold mb-2 text-[#606060] text-left">
          Похожие
        </h3>
      </div>
      <div className="flex flex-row xl:flex-col gap-2 md:gap-4 justify-center xl:justify-start">
        {similarProducts.map((product) => (
          <Link
            key={product.id}
            href={`/catalog/${product.categories[0]}/${product.id}?desc=${product.description}`}
            className="text-main-text text-sm md:text-lg flex flex-col items-center md:items-start justify-center pt-2 
            w-19.5 h-15.5 md:w-43 md:h-39.5 xl:w-42 xl:h-26 rounded bg-white shadow-image-block duration-300 
            hover:shadow-lg"
          >
            <div className="relative w-full h-6.25 md:h-27.75 xl:h-14.25 shrink-0">
              <Image
                src={product.img}
                alt={product.title}
                fill
                className="object-contain rounded"
                sizes="(max-width: 768px) 78px, (max-width: 1280px) 172px, 168px"
              />
            </div>
            <div className="flex items-center font-bold p-2 md:p-2.5">
              {calculatePrice(product)} ₽
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
