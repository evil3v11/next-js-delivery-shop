import { Order, OrderStatus } from "@/types/order";

export const getStatusText = (order: Order): string => {
  if (order.paymentMethod === "online") {
    if (order.paymentStatus === "failed") {
      return "Не оплачен";
    } else if (order.paymentStatus === "paid" && order.status === "confirmed") {
      return "Подтвержден";
    } else if (
      order.paymentStatus === "waiting" &&
      order.status === "pending"
    ) {
      return "В процессе";
    }
  }

  if (order.paymentMethod === "cash") {
    if (order.status === "pending" && order.paymentStatus === "pending") {
      return "Доставляется";
    } else if (order.status === "confirmed") {
      return "Подтвержден";
    }
  }

  const statusMap: Record<OrderStatus, string> = {
    pending: "В процессе",
    confirmed: "Подтвержден",
    delivered: "Получен",
    cancelled: "Отменен",
    collected: "Собран",
    delivering: "Доставляется",
    refund: "Возврат",
    returned: "Вернули",
    failed: "Не удалось",
  };

  return statusMap[order.status] || order.status;
};
