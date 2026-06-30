export interface FilterControlsProps {
  activeFilters?: string | string[];
  basePath: string;
  searchParams?: {
    page?: string;
    itemsPerPage?: string;
  };
}
