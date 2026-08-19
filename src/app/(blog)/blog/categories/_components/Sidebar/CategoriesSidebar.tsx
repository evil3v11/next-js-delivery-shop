"use client";

import { useEffect, useState } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import SidebarFloatingMenuButton from "./SidebarFloatingMenuButton";
import SidebarOverlay from "./SidebarOverlay";
import SidebarContent from "./SidebarContent";

const CategoriesSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { categories, fetchArticleCategories } = useArticleCategoriesStore();
  
  useEffect(() => {
    fetchArticleCategories()
  }, [fetchArticleCategories])

  return (
    <>
      {isSidebarOpen && <SidebarOverlay />}
      <SidebarFloatingMenuButton
        onClick={() => setIsSidebarOpen(true)}
        categoriesCount={categories.length}
      />
      <SidebarContent
        isSidebarOpen={isSidebarOpen}
        categories={categories}
        onCloseAction={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default CategoriesSidebar;
