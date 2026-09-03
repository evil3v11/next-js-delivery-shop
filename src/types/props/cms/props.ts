import { SortDirection } from "@/types/filters";

export interface CMSSearchBarProps {
  searchQuery: string;
  fetchItems: (queryParams?: {
    page?: number;
    query?: string;
  }) => Promise<void>;
  setCurrentPage: (currentPage: number) => void;
  setSearchQuery: (searchQuery: string) => void;
  clearSearchQuery: () => void;
}

export interface CMSFilterControlsProps<T, K> {
  sortField: T;
  filterType: K;
  sortDirection: SortDirection;
  searchQuery: string;
  setSortField: (sortField: T) => void;
  setFilterType: (filterType: K) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  setSearchQuery: (query: string) => void;
  fetchItems: (queryParams?: {
    page?: number;
    query?: string;
  }) => Promise<void>;
  onToggleFilters?: (showFilters: boolean) => void;
}

export interface CMSResultsStats {
  type: "categories" | "articles";
  totalFilteredItems: number;
  totalAllItems: number;
  searchQuery: string;
}
