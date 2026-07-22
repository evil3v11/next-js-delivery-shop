"use client";

interface UserListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserListPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: UserListPaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): number[] => {
    const maxVisible = 5;
    const pages = [];

    if (maxVisible >= totalPages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i + 1);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) start = end - maxVisible + 1;

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex gap-x-5 items-center justify-center">
      <div className="flex gap-2 p-5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-secondary 
          hover:text-white cursor-pointer duration-300"
        >
          Назад
        </button>
      </div>
      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`p-2 w-10 text-orange-600 hover:text-white 
            rounded cursor-pointer duration-300 
            ${currentPage === page ? "bg-secondary text-white" : "bg-secondary/40 hover:bg-secondary"}`}
        >
          {page}
        </button>
      ))}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-secondary 
          hover:text-white cursor-pointer duration-300"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default UserListPagination;
