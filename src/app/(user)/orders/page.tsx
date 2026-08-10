"use client";

import { useEffect, useState } from "react";

import { Order } from "@/types/order";

import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import OrdersList from "./_components/OrdersList";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Ошибка при запросе заказов");

        const data = await response.json();
        if (data.message)
          throw new Error(data.message || "Ошибка при запросе заказов");
        if (data.success) setOrders(data.orders || []);
      } catch (e) {
        setError({
          error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
          userMessage: "Ошибка при запросе заказов",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Заказов пока нет
        </h2>
        <p className="text-gray-500 max-w-md">
          Здесь будут отображаться ваши заказы, когда Вы сделаете покупки в
          нашем магазине
        </p>
      </div>
    );
  }

  return <OrdersList orders={orders} />;
};

export default OrdersPage;
