import { PriceRange } from "./priceTypes";

export interface PriceRangeSliderProps {
  priceRange: PriceRange;
  values: number[];
  onChangeSliderAction: (values: [number, number]) => void;
}
