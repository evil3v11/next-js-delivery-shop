import { CONFIG } from "../../../../../../config/config";

import { tableStyles } from "../../styles";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NavigationAndInfoProps {
  pageSize: number;
  currentPage: number;
  onPageSizeChange: (newSize: number) => void;
  totalUsers: number;
}

const NavigationAndInfo = ({
  pageSize,
  onPageSizeChange,
  totalUsers,
}: NavigationAndInfoProps) => {
  return (
    <div className={tableStyles.spacing.section}>
      <Link
        href="/admin"
        className="hover:underline flex items-center gap-3 text-sm lg:text-base max-w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад в панель управления
      </Link>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold">
            Список пользователей
          </h1>
          <p className="text-sm lg:text-base">
            Всего пользователей: {totalUsers}
          </p>
        </div>
        <div>
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-600 whitespace-nowrap"
          >
            Пользователей на странице: {}
          </label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 
            focus:ring-blue-500"
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {CONFIG.PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default NavigationAndInfo;
