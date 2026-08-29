export type ArticleStatus = "published" | "draft" | "archived" | "deleted";

export type Article = {
  _id: string;
  status: ArticleStatus;
};
