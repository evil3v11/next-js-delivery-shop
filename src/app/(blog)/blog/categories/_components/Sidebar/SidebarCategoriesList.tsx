import { BlogCategoriesListProps } from "../../_types/categoriesSidebar";
import CategoryItem from "./SidebarCategoryItem";

import SidebarEmptyState from "./SidebarEmptyState";

const SidebarCategoriesList = ({
  categories,
  searchQuery,
  onItemClick,
}: BlogCategoriesListProps) =>
  !categories.length ? (
    <SidebarEmptyState hasSearchQuery={!!searchQuery} />
  ) : (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <CategoryItem
          key={category._id}
          category={category}
          index={index}
          onClick={onItemClick}
        />
      ))}
    </div>
  );

export default SidebarCategoriesList;
