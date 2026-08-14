"use client";

import { useEffect, useState } from "react";

import { Product } from "@/types/product";
import { OrderItem } from "@/types/order";

import ProductsSection from "@/app/(products)/ProductsSection";
import MiniLoader from "@/components/MiniLoader";

type OrderProduct = Omit<OrderItem, "name" | "totalPrice"> & {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  totalPrice: number;
};

interface OrderProductsLoaderProps {
  orderItems: OrderProduct[];
  applyIndexStyle?: boolean;
  showFullOrder?: boolean;
  onTotalWeightCalculated?: (weight: number) => void;
}

const OrderProductsLoader = ({
  orderItems,
  applyIndexStyle = true,
  onTotalWeightCalculated,
}: OrderProductsLoaderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderProducts = async (): Promise<void> => {
      try {
        const productPromises = orderItems.map(async (item) => {
          const response = await fetch(`/api/products/${item.productId}`);
          const product: Product = await response.json();
          return { ...product, orderQuantity: item.quantity };
        });

        const products = await Promise.all<Product>(productPromises);
        setProducts(products);

        const weight = products.reduce((acc, curr, i) => {
          const itemWeight = curr.weight || 0;
          const quantity = orderItems[i].quantity || 1;
          return acc + itemWeight * quantity;
        }, 0);

        if (onTotalWeightCalculated) onTotalWeightCalculated(weight);
      } catch (e) {
        console.error("Ошибка:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderItems && orderItems.length > 0) {
      fetchOrderProducts();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [orderItems, onTotalWeightCalculated]);

  if (isLoading) return <MiniLoader />;
  if (!products.length) {
    return (
      <div className="text-center py-4">
        <div className="text-main-text">Товары не найдены</div>
      </div>
    );
  }

  return (
    <ProductsSection
      products={products}
      applyIndexStyle={applyIndexStyle}
      isAdminOrderPage={true}
    />
  );
};

export default OrderProductsLoader;
