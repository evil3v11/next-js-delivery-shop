export type ArticleStatus = "published" | "draft" | "archived" | "deleted";

export type Article = {
  _id: string;
  slug: string;
  name: string;
  image?: string;
  imageAlt?: string;
  description?: string;
  publishedAt?: string;
  content?: string;
  author?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  status: ArticleStatus;
  numericId: number;
  createdAt: string;
  updatedAt: string;
  keywords: string[];
  isFeatured: boolean;
  views: number;
};

export type ArticlesListProps = Pick<
  Article,
  "categorySlug" | "categoryName"
> & {
  articles: Article[];
};

export interface ArticleTitleProps {
  articleTitle: string;
  categoryName?: string;
}

export interface ArticleData extends Article {
  keywords: string[];
  views: number;
}

export type ArticleCategory = Pick<Article, "_id" | "name" | "slug">;

export interface ArticlePageData {
  article: ArticleData;
  category: ArticleCategory;
}

export interface ArticleMetaProps {
  categoryName: string;
  publishedDate?: string;
  views: number;
}

export interface ArticleHeaderProps {
  articleTitle: string;
  categoryName: string;
}

export interface ArticleImageProps {
  image?: string;
  imageAlt?: string;
  articleName: string;
}

export type FetchArticleError = {
  error:
    | "Такой категории не существует"
    | "Такой статьи не существует"
    | (string & {});
};
