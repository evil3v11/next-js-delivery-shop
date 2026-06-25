import { ProductCardProps } from "@/types/product";

const fetchPurchases = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/purchases`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error(`Error fetching purchase data`);

    const purchasedProducts: ProductCardProps[] = await response.json();
    return purchasedProducts;
  } catch (e) {
    console.error("Error fetching product data: ", e);
    throw e;
  }
};

export default fetchPurchases;
