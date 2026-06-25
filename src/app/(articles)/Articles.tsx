import fetchArticles from "./fetchArticles";

import ArticlesSection from "./ArticlesSection";

const Articles = async () => {
  const articles = await fetchArticles();
  return (
    <ArticlesSection
      title="Статьи"
      viewAllBtn={{ text: "Все статьи", href: "/articles" }}
      articles={articles}
      compact
    />
  );
};

export default Articles;
