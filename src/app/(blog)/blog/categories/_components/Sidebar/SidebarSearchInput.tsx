"use client";

import { SidebarSearchInputProps } from "../../_types/categoriesSidebar";
import { Search } from "lucide-react";

const SidebarSearchInput = ({ value, onChange }: SidebarSearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск категорий..."
        autoFocus
        className="text-gray-400 w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 
        dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        duration-300"
      />
    </div>
  );
};

export default SidebarSearchInput;
