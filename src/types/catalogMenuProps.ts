import { RefObject } from "react";
import { Category } from "./categories";
import { ErrorComponentProps } from "./errors";

export interface CatalogMenuProps {
  isLoading: boolean;
  isCatalogOpen: boolean;
  setIsCatalogOpen: (isOpen: boolean) => void;
  categories: Category[];
  error: ErrorComponentProps | null;
  searchBlockRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  onFocusChangeAction: (isFocused: boolean) => void;
  onMouseEnter: () => void;
}
