import fetchPurchases from "./fetchPurchases";
import ProductsSection from "../(products)/ProductsSection";
import { CONFIG } from "../../../config/config";

const Purchases = async () => {
  const { items } = await fetchPurchases({
    userPurchasesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
  });

  return (
    <ProductsSection
      title="Покупали раньше"
      viewAllBtn={{ text: "К покупкам", href: "/purchases" }}
      products={items}
    />
  );
};

export default Purchases;
