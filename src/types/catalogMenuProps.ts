import { RefObject } from "react";
import { ErrorComponentProps } from "./errors";
import { ProductCategory } from "./productCategories";

export interface CatalogMenuProps {
  isLoading: boolean;
  isCatalogOpen: boolean;
  setIsCatalogOpen: (isOpen: boolean) => void;
  categories: ProductCategory[];
  error: ErrorComponentProps | null;
  searchBlockRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  onFocusChangeAction: (isFocused: boolean) => void;
  onMouseEnter: () => void;
}
