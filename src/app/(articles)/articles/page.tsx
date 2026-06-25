import fetchArticles from "../fetchArticles";

import ArticlesSection from "../ArticlesSection";

export const metadata = {
  title: 'Статьи на сайте магазина "Северяночка"',
  description: 'Читайте статьи на сайте магазина "Северяночка"',
};

const AllArticles = async () => {
  const articles = await fetchArticles();
  return (
    <ArticlesSection
      title="Все статьи"
      viewAllBtn={{ text: "На главную", href: "/" }}
      articles={articles}
    />
  );
};

export default AllArticles;
