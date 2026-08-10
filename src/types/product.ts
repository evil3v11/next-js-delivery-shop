export type ProductRatings = {
  rate: number;
  count: number;
  distribution: Record<string, number>;
};

export interface ProductCardProps {
  _id: string;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: ProductRatings;
  weight: string;
  volume: string;
  categories: string[];
  quantity: number;
  tags: string[];
  article: number;
  manufacturer: string;
  brand: string;
  isNonGMO: boolean;
  isHealthyFood: boolean;
  orderQuantity?: number;
  isLowStock?: boolean;
  isInsufficientStock?: boolean;
  hasNoCard: boolean;
  hasLoyaltyDiscount?: boolean;
}
