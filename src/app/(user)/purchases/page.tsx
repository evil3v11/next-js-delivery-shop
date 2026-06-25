import ProductsSection from "@/app/(products)/ProductsSection";
import fetchPurchases from "../fetchPurchases";

const AllNewProducts = async () => {
  const purchasedProducts = await fetchPurchases();
  return (
    <ProductsSection
      title="Все покупки"
      viewAllBtn={{ text: "На главную", href: "/" }}
      products={purchasedProducts}
    />
  );
};

export default AllNewProducts;
