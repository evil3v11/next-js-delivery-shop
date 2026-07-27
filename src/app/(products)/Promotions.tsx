import { CONFIG } from "../../../config/config";

import fetchProductsByTag from "./fetchProducts";

import ProductsSection from "./ProductsSection";

const Promotions = async ({
  randomLimit = CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
  mobileItemsLimit = 4,
}: {
  randomLimit?: number;
  mobileItemsLimit?: number;
}) => {
  const { items } = await fetchProductsByTag("actions", { randomLimit });

  return (
    <ProductsSection
      title="Акции"
      viewAllBtn={{ text: "Все акции", href: "/actions" }}
      products={items}
      mobileItemsLimit={mobileItemsLimit}
    />
  );
};

export default Promotions;
