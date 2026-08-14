import { CUSTOMER_STATUSES } from "@/data/customerStatuses";

import { Order, OrderStatusRu, OrderStatus } from "@/types/order";

export const getMappedStatus = (order: Order): OrderStatusRu | OrderStatus => {
  if (order.paymentMethod === "online") {
    if (order.paymentStatus === "paid" && order.status === "confirmed") {
      return "Подтвержден";
    } else if (order.paymentStatus === "failed" && order.status === "cancelled") {
      return "Не подтвердили";
    } else if (order.paymentStatus === "waiting" && order.status === "pending") {
      return "Новый";
    }
  }

  if (order.paymentMethod === "cash") {
    if (order.status === "pending" && order.paymentStatus === "pending") {
      return "Доставляется";
    } else if (order.status === "confirmed") {
      return "Подтвержден";
    }
  }

  const statusFromValue = CUSTOMER_STATUSES.find((s) => s.value === order.status);

  if (statusFromValue) return statusFromValue.label;

  return "Новый";
};
