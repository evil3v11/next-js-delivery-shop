import { Category } from "../../entities";

export type UpdateFormData = Omit<
  Category,
  "_id" | "numericId" | "author" | "createdAt" | "updatedAt"
>;

export type CategoryFormData = Omit<UpdateFormData, "keywords"> & {
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

export type CharCount = Record<keyof Omit<CategoryFormData, "image">, number>;
