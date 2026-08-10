import { CustomCartItem, CustomPricing } from "../cart";
import { ProductsData } from "../order";

export type UseOrderPricingResult = {
  cartItemsForSummary: CustomCartItem[];
  productsData: ProductsData;
  customPricing: CustomPricing;
};
