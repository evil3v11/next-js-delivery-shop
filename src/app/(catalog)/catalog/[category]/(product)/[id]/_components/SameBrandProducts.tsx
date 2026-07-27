import { ProductCardProps } from "@/types/product";

import ProductsSection from "@/app/(products)/ProductsSection";

const SameBrandProducts = async ({
  currentProduct,
}: {
  currentProduct: ProductCardProps;
}) => {
  if (!currentProduct) return null;

  let sameBrandProducts: ProductCardProps[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/brand?productId=${currentProduct.id}&brand=${currentProduct.brand}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok)
      throw new Error("Не удалось получить продукты того же бренда");

    sameBrandProducts = await response.json();
    if (sameBrandProducts.length === 0) return null;
  } catch (e) {
    console.error(e instanceof Error ? e.message : "Неизвестная ошибка");
  }

  return (
    <ProductsSection
      title="С этим товаром покупают"
      products={sameBrandProducts}
    />
  );
};

export default SameBrandProducts;
