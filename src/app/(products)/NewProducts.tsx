import { shuffleArray } from "@/utils/shuffleArray";

import fetchProductsByCategory from "./fetchProducts";
import ProductsSection from "./ProductsSection";

const NewProducts = async () => {
  const products = await fetchProductsByCategory("new");
  return (
    <ProductsSection
      title="Новинки"
      viewAllBtn={{ text: "Все новинки", href: "/new" }}
      products={shuffleArray(products)}
      compact
    />
  );
};

export default NewProducts;
