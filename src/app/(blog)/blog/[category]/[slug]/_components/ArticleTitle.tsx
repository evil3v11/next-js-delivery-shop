"use client";

import { useEffect } from "react";
import { useCategoryTitle } from "@/app/contexts/CategoryContext";
import { useArticleTitle } from "@/app/contexts/ArticleContext";

import { ArticleTitleProps } from "@/types/entities";

const ArticleTitle = ({ articleTitle, categoryName }: ArticleTitleProps) => {
  const { setCategoryTitle } = useCategoryTitle();
  const { setArticleTitle } = useArticleTitle();

  useEffect(() => {
    setArticleTitle(articleTitle);
    if (categoryName) setCategoryTitle(categoryName);
    return () => {
      setArticleTitle("");
      setCategoryTitle("");
    };
  }, [articleTitle, categoryName, setCategoryTitle, setArticleTitle]);

  return <h1 className="text-3xl font-bold mb-4">{articleTitle}</h1>;
};

export default ArticleTitle;
