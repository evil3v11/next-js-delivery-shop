import { ArticleCardProps } from "@/types/articles";

const fetchArticles = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/articles`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error(`Error fetching articles data`);

    const articles: ArticleCardProps[] = await response.json();
    return articles;
  } catch (e) {
    console.error("Error fetching articles: ", e);
    throw e;
  }
};

export default fetchArticles;
