import { useArticleStore } from "@/store/articleStore";

import { ArticleSortField } from "@/types/filters";

import { ChevronUp, Eye, Star } from "lucide-react";

const ArticleTableHeader = () => {
  const {
    currentPage,
    searchQuery,
    filterType,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    fetchArticles,
  } = useArticleStore();

  const handleSort = async (field: ArticleSortField): Promise<void> => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    await fetchArticles({
      page: currentPage,
      query: searchQuery,
      filterBy: filterType,
    });
  };

  const renderSortIcon = (
    field: ArticleSortField,
  ): React.JSX.Element | null => {
    if (sortField !== field) return null;
    return (
      <ChevronUp
        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
          sortDirection === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  return (
    <div className="hidden lg:block border border-gray-200">
      <div
        className="grid lg:grid-cols-[32px_56px_100px_100px_100px_56px_128px_80px_80px_40px_100px] 
      xl:grid-cols-[32px_56px_170px_150px_150px_56px_128px_100px_120px_50px_100px] gap-2 px-4 py-4 
      bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider 
      items-center justify-between"
      >
        <div />
        <div
          title="Сортировать по ID"
          onClick={() => handleSort("numericId")}
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
        >
          ID
          {renderSortIcon("numericId")}
        </div>
        <div
          title="Сортировать по названию"
          onClick={() => handleSort("name")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Название
          {renderSortIcon("name")}
        </div>
        <div
          title="Сортировать по алиасу"
          onClick={() => handleSort("slug")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Алиас
          {renderSortIcon("slug")}
        </div>
        <div
          title="Сортировать по категории"
          onClick={() => handleSort("categoryName")}
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
        >
          Категория
          {renderSortIcon("categoryName")}
        </div>
        <div
          title="Сортировать по избранности"
          onClick={() => handleSort("isFeatured")}
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
        >
          <Star />
          {renderSortIcon("isFeatured")}
        </div>
        <div
          title="Сортировать по дате статусу"
          onClick={() => handleSort("status")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Статус
          {renderSortIcon("status")}
        </div>
        <div
          title="Сортировать по автору"
          onClick={() => handleSort("author")}
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
        >
          Автор
          {renderSortIcon("author")}
        </div>
        <div
          title="Сортировать по дате создания"
          onClick={() => handleSort("createdAt")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          Создана
          {renderSortIcon("createdAt")}
        </div>
        <div
          title="Сортировать по дате просмотрам"
          onClick={() => handleSort("views")}
          className="cursor-pointer hover:text-gray-700 flex items-center"
        >
          <Eye />
          {renderSortIcon("views")}
        </div>
        <div className="text-center">Действия</div>
      </div>
    </div>
  );
};

export default ArticleTableHeader;
