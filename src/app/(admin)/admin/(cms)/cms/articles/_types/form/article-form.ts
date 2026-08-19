import { ArticleStatus } from "../../../_types";
import { CategoryFormProps } from "../../../categories/_types";

export type ArticleFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  status: ArticleStatus;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
};

export type UpdateArticleFormData = Omit<ArticleFormData, "keywords"> & {
  keywords: string[];
};

export type ArticleFormProps = Omit<CategoryFormProps, "errors" | "showForm">;

export interface CategorySelectProps {
  value: string;
  onChange: (
    categoryId: string,
    categoryName: string,
    categorySlug: string,
  ) => void;
}
