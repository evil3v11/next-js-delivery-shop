import { useEffect, useState } from "react";

import { Order } from "@/types/order";
import { UseOrderProductsDataResult } from "@/types/hooks/useOrderProductsData";
import { Product } from "@/types/product";

export const useOrderProductsData = (order: Order): UseOrderProductsDataResult => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isProductsDataLoading, setIsProductsDataLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductsData = async (): Promise<void> => {
      const data = await Promise.all(
        order.items.map(async ({ productId }) => {
          const response = await fetch(`/api/products/${productId}`);
          return response.json();
        }),
      );

      setProductsData(data);
      setIsProductsDataLoading(false);
    };

    if (order.items.length > 0) fetchProductsData();
  }, [order.items]);

  return { productsData, isProductsDataLoading };
};
