import ProductCard from "@/components/ProductCard";

import { ProductCardProps } from "@/types/product";
import { shuffleArray } from "@/utils/shuffleArray";

const AllPromotions = async () => {
  let products: ProductCardProps[] = [];
  let error = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/products?category=actions`,
    );
    products = await response.json();
    products = shuffleArray(products);
  } catch (e) {
    error = "Error fetching all promotional products";
    console.error("Error in AllPromotions component: ", e);
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return (
    <section>
      <div className="flex flex-col my-10 px-[max(12px,calc((100%-1208px)/2))]">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            Все акции
          </h2>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {products.map((item) => (
            <li key={item._id} className="flex justify-center">
              <ProductCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AllPromotions;
