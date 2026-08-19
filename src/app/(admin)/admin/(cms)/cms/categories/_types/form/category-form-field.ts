import { CharCount } from "../../../_types/charCount";
import { CategoryFormData } from "./category-form";

export type CategoryFormField = keyof CategoryFormData

export interface CategoryFormFieldsProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onInputChange: (field: CategoryFormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}