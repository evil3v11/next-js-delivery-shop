import { Category } from "@/types/entities";

export interface SortableItemProps {
  id: string;
  category: Category;
  displayNumericId: number | null;
  onDelete: (categoryId: string) => void;
  onEdit: (category: Category) => void;
}

export type CategoryRowProps = Omit<SortableItemProps, "id"> & {
  isBeingDragged: boolean;
};

export type MobileCategoryHeaderProps = Pick<
  SortableItemProps,
  "category" | "displayNumericId"
>;

export type MobileExpandableContentProps = Omit<
  SortableItemProps,
  "displayNumericId" | "id"
>;
