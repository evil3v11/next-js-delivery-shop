export type ArticleStatus = "published" | "draft" | "archived" | "deleted";

export type Article = {
  status: ArticleStatus;
};
