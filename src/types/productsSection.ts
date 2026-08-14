import { Product } from "./product";

export interface ProductsSectionProps {
  products: Product[];
  title?: string;
  viewAllBtn?: {
    text: string;
    href: string;
  };
  mobileItemsLimit?: number;
}
