import { CONFIG } from "../../../config/config";

import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "./ProductsSection";

const NewProducts = async () => {
  const { items } = await fetchProductsByTag("actions", {
    randomLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
  });

  return (
    <ProductsSection
      title="Новинки"
      viewAllBtn={{ text: "Все новинки", href: "/new" }}
      products={items}
    />
  );
};

export default NewProducts;
