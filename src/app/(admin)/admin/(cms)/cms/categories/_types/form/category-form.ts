import { Category } from "../../../_types";

export type UpdateCategoryFormData = Omit<
  Category,
  | "_id"
  | "numericId"
  | "author"
  | "createdAt"
  | "updatedAt"
  | "numberOfArticles"
>;

export type CategoryFormData = Omit<UpdateCategoryFormData, "keywords"> & {
  keywords: string;
};

export interface CategoryFormProps {
  showForm: boolean;
  errors: Record<string, string>;
  onGenerateSlug: () => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.SubmitEvent) => Promise<void>;
  onCancel: () => void;
}
