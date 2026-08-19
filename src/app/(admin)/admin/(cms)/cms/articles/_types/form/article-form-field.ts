import { CharCount } from "../../../_types/charCount";
import { UpdateArticleFormData } from "./article-form";

export type ArticleFormField = keyof UpdateArticleFormData;

export interface ArticleFormFieldsProps {
  charCount: CharCount;
  onInputChange: (
    field: ArticleFormField,
    value: string,
    maxLength: number,
  ) => void;
  onGenerateSlug: () => void;
}
