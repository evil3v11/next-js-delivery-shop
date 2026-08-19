"use client";

import { useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { SidebarContentProps } from "../../_types/categoriesSidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarCategoriesList from "./SidebarCategoriesList";

const SidebarContent = ({
  isSidebarOpen,
  categories,
  onCloseAction,
}: SidebarContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarRef = useClickOutsideModal<HTMLDivElement>(onCloseAction);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl 
        z-50 transform transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <SidebarHeader
        categoriesCount={categories.length}
        onClose={onCloseAction}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="h-[calc(100vh-180px)] overflow-y-auto">
        <div className="p-4">
          <SidebarCategoriesList
            categories={categories}
            searchQuery={searchQuery}
            onItemClick={onCloseAction}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
