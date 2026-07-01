export interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (isOpen: boolean) => void
}

export type PriceRange = {
  min: number;
  max: number;
};