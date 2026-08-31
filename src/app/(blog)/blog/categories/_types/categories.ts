import { Category } from "@/types/entities";

export type BlogCategory = Omit<Category, "keywords"> & {
  articleCount?: number;
};

export type BlogCategoryContentProps = Pick<
  BlogCategory,
  "createdAt" | "name" | "description" | "slug"
> &
  Partial<Pick<BlogCategory, "author">>;

export type BlogCategoryMetaProps = Pick<
  BlogCategoryContentProps,
  "author" | "createdAt"
>;

export interface BlogCategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    imageAlt: string;
    createdAt: string;
    updatedAt: string;
    author: string;
  };
  priority?: boolean;
}

export interface BlogCategoriesListProps {
  categories: BlogCategory[];
}

export interface CategoriesSidebarProps {
  categories: BlogCategory[];
}

export interface CategoryImageProps {
  hasImage: boolean | string;
  image: string;
  imageAlt: string;
  gradientClass: string;
  name: string;
  priority: boolean;
}
