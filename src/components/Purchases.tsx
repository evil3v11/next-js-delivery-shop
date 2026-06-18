import { ProductCardProps } from "@/types/product";
import { shuffleArray } from "@/utils/shuffleArray";

import ProductCard from "./ProductCard";
import ViewAllButton from "./ViewAllButton";

const Purchases = async () => {
  let products: ProductCardProps[] = [];
  let error = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/purchases`,
    );
    products = await response.json();
    products = shuffleArray(products);

  } catch (e) {
    error = "Error fetching purchases";
    console.error("Error in Purchases component: ", e);
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return (
    <section>
      <div className="flex flex-col justify-center xl:max-w-[1208px]">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            Покупали раньше
          </h2>
          <ViewAllButton btnText="Все покупки" href="purchases" />
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {products.slice(0, 4).map((item, index) => (
            <li
              key={item._id}
              className={`flex justify-center ${index >= 4 ? "hidden" : ""} ${index >= 3 ? "md:hidden xl:block" : ""} ${index >= 4 ? "xl:hidden" : ""}`}
            >
              <ProductCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Purchases;
