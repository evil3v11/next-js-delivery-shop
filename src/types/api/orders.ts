export type FetchOrdersResponse<T> =
  | {
      success: true;
      orders: T[];
    }
  | {
      success: false;
      message: string;
    };
