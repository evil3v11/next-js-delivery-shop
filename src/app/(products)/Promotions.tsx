import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "./ProductsSection";
import { CONFIG } from "../../../config/config";

const Promotions = async () => {
  const { items } = await fetchProductsByTag("actions", {
    randomLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
  });

  return (
    <ProductsSection
      title="Акции"
      viewAllBtn={{ text: "Все акции", href: "/actions" }}
      products={items}
    />
  );
};

export default Promotions;
