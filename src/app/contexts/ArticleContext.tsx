"use client";

import { createContext, useContext, useState } from "react";

type ArticleContext = {
  articleTitle: string;
  setArticleTitle: (title: string) => void;
};

const ArticleContext = createContext<ArticleContext>({
  articleTitle: "",
  setArticleTitle: () => {},
});

const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articleTitle, setArticleTitle] = useState("");

  return (
    <ArticleContext.Provider value={{ articleTitle, setArticleTitle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticleTitle = () => useContext(ArticleContext);

export default ArticleProvider;
