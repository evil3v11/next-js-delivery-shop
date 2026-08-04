import { Order } from "@/types/order";

export const createOrderAction = async (order: Order) => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Ошибка при создании заказа");
    return await response.json();
  } catch (e) {
    console.error("Ошибка при создании заказа: ", e);
    throw e;
  }
};
