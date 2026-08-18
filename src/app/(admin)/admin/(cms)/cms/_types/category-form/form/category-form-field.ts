import { CategoryFormData, CharCount } from "./category-form";

export type FormField = keyof CategoryFormData

export interface CategoryFormFieldsProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}