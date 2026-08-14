import { useEffect, useState } from "react";

import { Order } from "@/types/order";
import { UseOrderProductsResult } from "@/types/hooks/useOrderProducts";
import { Product, ProductCardProps } from "@/types/product";

export const useOrderProducts = (
  order: Order,
  productsData?: Product[],
): UseOrderProductsResult => {
  const [orderProducts, setOrderProducts] = useState<ProductCardProps[]>([]);
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);

  useEffect(() => {
    const processProducts = async () => {
      try {
        const warnings: string[] = [];

        if (productsData && productsData.length > 0) {
          const processedProducts = order.items.map((item, i) => {
            const product = productsData[i];
            if (!product) return null;

            const availableQuantity = product.quantity;
            const orderQuantity = item.quantity;
            const isLowStock = orderQuantity > availableQuantity;
            const isInsufficientStock = availableQuantity === 0;

            if (isLowStock) {
              if (isInsufficientStock) {
                warnings.push(
                  `Товар "${product.title}" временно отсутствует на складе`,
                );
              } else {
                warnings.push(
                  `Товар "${product.title}" осталось в количестве ${availableQuantity} шт.`,
                );
              }
            }

            const productCardData = {
              _id: product._id,
              id: product.id,
              img: product.img,
              title: product.title,
              description: product.description,
              rating: product.rating,
              quantity: product.quantity,
              categories: product.categories || [],
              basePrice: item.price,
              discountPercent: item.discountPercent || 0,
              orderQuantity,
              isLowStock,
              isInsufficientStock,
            } as ProductCardProps;

            return productCardData;
          });
          const validProducts = processedProducts.filter((p) => p !== null);

          setOrderProducts(validProducts);
          setStockWarnings(warnings);
        }
      } catch (e) {
        console.error("Ошибка при загрузке товаров заказа: ", e);
      }
    };

    processProducts();
  }, [order, productsData]);

  return { orderProducts, stockWarnings };
};
