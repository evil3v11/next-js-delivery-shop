import fetchProductsByCategory from "../fetchProducts";
import ProductsSection from "../ProductsSection";

export const metadata = {
  title: 'Новинки магазина "Северяночка"',
  description: 'Новые товары магазина "Северяночка"',
};

const AllNewProducts = async () => {
  const products = await fetchProductsByCategory("new");
  return (
    <ProductsSection
      title="Все новинки"
      viewAllBtn={{ text: "На главную", href: "/" }}
      products={products}
    />
  );
};

export default AllNewProducts;
