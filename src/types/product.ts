export type ProductRatings = {
  rate: number;
  count: number;
  distribution: Record<string, number>;
};

export type Product = {
  _id: string;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: ProductRatings;
  weight: number;
  categories: string[];
  quantity: number;
  tags: string[];
  article: number;
  manufacturer: string;
  brand: string;
  isNonGMO: boolean;
  isHealthyFood: boolean;
}

export interface ProductCardProps extends Product {
  volume: string;
  orderQuantity?: number;
  isLowStock?: boolean;
  isInsufficientStock?: boolean;
  hasNoCard: boolean;
  hasLoyaltyDiscount?: boolean;
}
