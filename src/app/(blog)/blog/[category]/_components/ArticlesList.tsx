import { ArticlesListProps } from "@/types/entities"

import ArticleCard from "@/app/(articles)/ArticleCard";

const ArticlesList = ({
  articles,
  categorySlug,
  categoryName,
}: ArticlesListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
    {articles.map((article, index) => {
      const delayClass = `animate-delay-${Math.min(index, 8)}`;

      return (
        <div
          key={String(article._id)}
          className={`animate-gentle-appear ${delayClass}`}
        >
          <ArticleCard
            slug={article.slug}
            categorySlug={categorySlug}
            name={article.name}
            image={article.image}
            imageAlt={article.imageAlt}
            categoryName={categoryName}
            description={article.description}
            publishedAt={article.publishedAt}
          />
        </div>
      );
    })}
  </div>
);

export default ArticlesList;
