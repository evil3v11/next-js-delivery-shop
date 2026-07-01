import { PriceRange } from "./priceTypes";

export interface PriceInputsProps {
  inputValues: {
    from: string;
    to: string;
  };
  priceRange: PriceRange;
  onChangeFromAction: (value: string) => void;
  onChangeToAction: (value: string) => void;
}
