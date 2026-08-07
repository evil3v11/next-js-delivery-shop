import { CONFIG } from "../../../config/config";

import fetchProductsByTag from "./fetchProducts";

import ProductsSection from "./ProductsSection";

const Promotions = async ({
  mobileItemsLimit = 4,
}: {
  mobileItemsLimit?: number;
}) => {
  const { products } = await fetchProductsByTag("actions", {
    pagination: { startIdx: 0, perPage: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS },
  });

  return (
    <ProductsSection
      title="Акции"
      viewAllBtn={{ text: "Все акции", href: "/actions" }}
      products={products}
      mobileItemsLimit={mobileItemsLimit}
    />
  );
};

export default Promotions;
