export interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (isOpen: boolean) => void;
  userId?: string;
  apiEndpoint?: string;
}

export type PriceRange = {
  min: number;
  max: number;
};
