import { Product } from "../product"

export type UseOrderProductsDataResult = {
  productsData: Product[],
  isProductsDataLoading: boolean;
}