import { ProductCardProps } from "./product";

export interface ProductsSectionProps {
  title: string;
  viewAllBtn: {
    text: string;
    href: string;
  };
  products: ProductCardProps[];
  compact?: boolean;
}
