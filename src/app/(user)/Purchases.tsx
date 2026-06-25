import fetchPurchases from "./fetchPurchases";
import ProductsSection from "../(products)/ProductsSection";

const Purchases = async () => {
  const purchasedProducts = await fetchPurchases();
  return (
    <ProductsSection
      title="Покупали раньше"
      viewAllBtn={{ text: "К покупкам", href: "/purchases" }}
      products={purchasedProducts}
      compact
    />
  );
};

export default Purchases;
