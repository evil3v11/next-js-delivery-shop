import { ProductCardProps } from "@/types/product";

const fetchProductsByCategory = async (category: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/products?category=${category}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok)
      throw new Error(`Error fetching ${category} product data`);

    const products: ProductCardProps[] = await response.json();
    const availableProducts = products.filter((p) => p.quantity > 0);

    return availableProducts;
  } catch (e) {
    console.error("Error fetching product data: ", e);
    throw e;
  }
};

export default fetchProductsByCategory;
