"use client";

import { useEffect } from "react";
import { useCategoryTitle } from "@/app/contexts/CategoryContext";

const CategoryTitle = ({ categoryTitle }: { categoryTitle: string }) => {
  const { setCategoryTitle } = useCategoryTitle();
  
  useEffect(() => {
    setCategoryTitle(categoryTitle);
    return () => setCategoryTitle("");
  }, [categoryTitle, setCategoryTitle]);

  return <h1 className="text-3xl font-bold mb-4">{categoryTitle}</h1>;
};

export default CategoryTitle;
