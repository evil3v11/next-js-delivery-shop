import fetchProductsByCategory from "./fetchProducts";
import ProductsSection from "./ProductsSection";

const Promotions = async () => {
  const products = await fetchProductsByCategory("actions");
  return (
    <ProductsSection
      title="Акции"
      viewAllBtn={{ text: "Все акции", href: "/actions" }}
      products={products}
      compact
    />
  );
};

export default Promotions;
