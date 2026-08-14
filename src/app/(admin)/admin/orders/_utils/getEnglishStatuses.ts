import { Order, OrderStatus, PaymentStatus } from "@/types/order";

export const getEnglishStatuses = (
  russianStatus: string,
  order: Order,
): { status: OrderStatus; paymentStatus?: PaymentStatus } => {
  if (order.paymentMethod === "online") {
    switch (russianStatus) {
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "paid" };
      case "Не подтвердили":
        return { status: "cancelled", paymentStatus: "failed" };
      case "Новый":
        return { status: "pending", paymentStatus: "waiting" };
    }
  }

  if (order.paymentMethod === "cash") {
    switch (russianStatus) {
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "pending" };
      case "Новый":
        return { status: "pending", paymentStatus: "pending" };
    }
  }

  const statusMap: Record<string, OrderStatus> = {
    "В процессе": "pending",
    Возврат: "refund",
    Вернули: "returned",
    Собран: "collected",
    Доставляется: "delivering",
    Подтвержден: "confirmed",
    Получен: "delivered",
    "Не подтвердили": "cancelled",
    "Не удалось": "failed",
  };

  return { status: statusMap[russianStatus] || "pending" };
};
