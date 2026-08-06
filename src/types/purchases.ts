import { ProductCardProps } from "./product"

export interface FetchPurchasesError {
  message: string;
}

export interface FetchPurchasesResponse {
  products: ProductCardProps[],
  totalCount: number;
}