"use client";

import { createContext, useContext, useState } from "react";

type CategoryContext = {
  categoryTitle: string;
  setCategoryTitle: (title: string) => void;
};

const CategoryContext = createContext<CategoryContext>({
  categoryTitle: "",
  setCategoryTitle: () => {},
});

const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryTitle, setCategoryTitle] = useState("");

  return (
    <CategoryContext.Provider value={{ categoryTitle, setCategoryTitle }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryTitle = () => useContext(CategoryContext);

export default CategoryProvider;
