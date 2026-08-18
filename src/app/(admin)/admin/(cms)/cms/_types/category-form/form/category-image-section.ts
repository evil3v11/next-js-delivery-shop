import { CharCount } from "./category-form";
import { FormField } from "./category-form-field";

export interface CategoryImageSectionProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onRemoveImage: () => void;
  onSaveImageFile: (file: File) => void;
}