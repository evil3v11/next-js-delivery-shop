"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { CMS_CONFIG } from "../cms_config";

const CMSPagination = () => {
  const {
    totalPages,
    totalFilteredItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
  } = useArticleCategoriesStore();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalFilteredItems);

  const renderPageButtons = (): React.JSX.Element[] => {
    const pageButtons = [];

    if (totalPages <= CMS_CONFIG.MAX_VISIBLE_BUTTONS) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= CMS_CONFIG.MAX_VISIBLE_BUTTONS; i++) {
        pageButtons.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (
        let i = totalPages - CMS_CONFIG.MAX_VISIBLE_BUTTONS + 1;
        i <= totalPages;
        i++
      ) {
        pageButtons.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageButtons.push(i);
      }
    }
    
    return pageButtons.map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`flex items-center justify-center w-11 h-11 px-4 py-2 border rounded cursor-pointer duration-300 
          ${
            currentPage === page
              ? "bg-primary text-white border-primary hover:bg-primary"
              : "border-gray-300 hover:bg-gray-50"
          }`}
      >
        {page}
      </button>
    ));
  };

  const handlePageChange = (page: number): void => setCurrentPage(page);

  return (
    <div className=" py-4 border-t border-gray-200">
      <div className="flex flex-col gap-y-5 md:flex-row justify-between items-center">
        <div className="text-sm text-gray-700 flex flex-col md:flex-row self-start">
          <span>
            Показано {startItem}-{endItem} из {totalFilteredItems} элементов
          </span>
          <span className="mx-2 hidden md:block">•</span>
          <span>
            Страница <span className="font-medium">{currentPage}</span> из{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 duration-300"
          >
            Назад
          </button>
          {renderPageButtons()}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 duration-300"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};

export default CMSPagination;
