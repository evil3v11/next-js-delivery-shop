import { Product } from "./product"

export interface FetchPurchasesError {
  message: string;
}

export interface FetchPurchasesResponse {
  products: Product[],
  totalCount: number;
}