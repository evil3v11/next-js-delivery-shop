import { Order } from "@/types/order";

export const getUniqueCities = (slotOrders: Order[]): string[] => {
  const cities = new Set(
    slotOrders
      .map((order) => order.deliveryAddress.city)
      .filter((city) => city),
  );
  return ["Все города", ...cities];
};
