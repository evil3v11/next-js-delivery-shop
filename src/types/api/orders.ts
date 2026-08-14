import { ApiResponse } from "./default-response";
import { OrdersResponse } from "./ordersApi";

export type FetchOrdersResponse<T> =
  | {
      success: true;
      orders: T[];
    }
  | {
      success: false;
      message: string;
    };

export type GetAdminOrders =
  ApiResponse | (Pick<ApiResponse, "success"> & OrdersResponse);
