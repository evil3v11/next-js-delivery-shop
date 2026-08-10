import { PriceComparison, CurrentProduct } from "../order";

export type UsePriceComparisonResult = {
  currentProducts: CurrentProduct[];
  priceComparison: PriceComparison | null;
};
