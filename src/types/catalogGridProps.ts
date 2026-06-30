import { CatalogProps } from "./catalog";

export interface CatalogGridProps {
  categories: CatalogProps[];
  isEditing: boolean;
  hoveredCategoryId: string | null;
  draggingCategory: CatalogProps | null;
  onDragStartAction: (category: CatalogProps) => void;
  onDragOverAction: (e: React.DragEvent, categoryId: string) => void;
  onDragLeaveAction: () => void;
  onDropAction: (e: React.DragEvent, targetCategoryId: string) => void;
}
