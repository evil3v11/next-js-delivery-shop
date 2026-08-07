import { CONFIG } from "../../../config/config";

import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "./ProductsSection";

const NewProducts = async () => {
  const { products } = await fetchProductsByTag("actions", {
    pagination: { startIdx: 0, perPage: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS },
  });

  return (
    <ProductsSection
      title="Новинки"
      viewAllBtn={{ text: "Все новинки", href: "/new" }}
      products={products}
    />
  );
};

export default NewProducts;
