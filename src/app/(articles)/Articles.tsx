import fetchArticles from "./fetchArticles";

import ArticlesSection from "./ArticlesSection";
import { CONFIG } from "../../../config/config";

const Articles = async () => {
  const { products } = await fetchArticles({
    articlesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES,
  });

  return (
    <ArticlesSection
      title="Статьи"
      viewAllBtn={{ text: "Все статьи", href: "/articles" }}
      articles={products}
    />
  );
};

export default Articles;
