import { OrderStatus } from "@/types/order";

export const getStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    pending: "В процессе",
    confirmed: "В процессе",
    delivered: "Получен",
    cancelled: "Возврат",
    failed: "Не доставлен",
  };

  return statusMap[status] || status;
};
