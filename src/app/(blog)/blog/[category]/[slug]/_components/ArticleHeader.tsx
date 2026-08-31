import { ArticleHeaderProps } from "@/types/entities";

import ArticleTitle from "./ArticleTitle";

const ArticleHeader = ({ articleTitle, categoryName }: ArticleHeaderProps) => (
  <ArticleTitle articleTitle={articleTitle} categoryName={categoryName} />
);

export default ArticleHeader;
