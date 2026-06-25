import fetchProductsByCategory from "../fetchProducts";
import ProductsSection from "../ProductsSection";

export const metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
};

const AllPromotions = async () => {
  const products = await fetchProductsByCategory("actions");
  return (
    <ProductsSection
      title="Все акции"
      viewAllBtn={{ text: "На главную", href: "/" }}
      products={products}
    />
  );
};

export default AllPromotions;
