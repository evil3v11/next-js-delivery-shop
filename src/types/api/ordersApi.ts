import { Order } from "../order";

export type OrdersResponse = {
  orders: Order[];
  stats: { amountOfNextThreeDaysOfOrders: number };
};
