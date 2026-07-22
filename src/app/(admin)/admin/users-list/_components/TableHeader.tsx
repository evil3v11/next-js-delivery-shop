import { SortUsersBy } from "@/types/AdminPanelUsersListSortBy";
import { columns } from "@/data/columnsUserslist";

import { tableStyles } from "../../styles";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableHeaderProps {
  sortBy: SortUsersBy;
  sortDirection: "asc" | "desc";
  onSort: (field: SortUsersBy, direction: "asc" | "desc") => void;
}

const TableHeader = ({ sortBy, sortDirection, onSort }: TableHeaderProps) => {
  const handleIconClick = (
    e: React.MouseEvent,
    field: SortUsersBy,
    direction: "asc" | "desc",
  ): void => {
    e.stopPropagation();
    onSort(field, direction);
  };

  return (
    <div
      className={`hidden md:grid grid-cols-1 md:grid-cols-12 md:gap-2 rounded bg-[#f3f2f1] 
        ${tableStyles.spacing.cell} ${tableStyles.border.bottom}`}
    >
      {columns.map(({ key, label, span, sortable }) => {
        const isSortActive = key === sortBy;
        return (
          <div
            key={key}
            className={`${span} text-xs break-all font-semibold duration-300 
          ${key !== "createdAt" ? tableStyles.border.right : ""}
          ${sortable ? "cursor-default" : "cursor-not-allowed opacity-50"}`}
          >
            <div className="flex justify-center items-center gap-1">
              {label}
              {sortable && (
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-4 w-4 cursor-pointer ${
                      isSortActive && sortDirection === "asc"
                        ? "text-[#008c48]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={(e) =>
                      handleIconClick(e, key as SortUsersBy, "asc")
                    }
                  />
                  <ChevronDown
                    className={`h-4 w-4 -mt-1 cursor-pointer ${
                      isSortActive && sortDirection === "desc"
                        ? "text-[#008c48]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={(e) =>
                      handleIconClick(e, key as SortUsersBy, "desc")
                    }
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;
