import { Product } from "@/types/product";
import { baseUrl } from "@/utils/baseUrl";

export const getProduct = async (
  productId: string,
): Promise<Product> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/products/${productId}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

    const product: Product = await response.json();
    return product;
  } catch (e) {
    console.log("Ошибка при запросе продукта: ", e);
    throw e;
  }
};
