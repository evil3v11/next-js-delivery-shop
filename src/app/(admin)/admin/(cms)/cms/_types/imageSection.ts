import { ArticleFormField } from "../articles/_types";
import { CategoryFormField } from "../categories/_types/form/category-form-field";
import { CharCount } from "./charCount";

type FormField = ArticleFormField | CategoryFormField

export interface ImageSectionProps {
  type: "category" | "article";
  errors?: Record<string, string>;
  charCount: CharCount;
  onInputChange: <T extends FormField>(
    field: T,
    value: string,
    maxLength: number,
  ) => void;
  onRemoveImage: () => void;
  onSaveImageFile: (file: File) => void;
}
