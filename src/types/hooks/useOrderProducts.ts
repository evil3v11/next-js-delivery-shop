import { ProductCardProps } from "../product";

export type UseOrderProductsResult = {
  orderProducts: ProductCardProps[];
  stockWarnings: string[];
};
