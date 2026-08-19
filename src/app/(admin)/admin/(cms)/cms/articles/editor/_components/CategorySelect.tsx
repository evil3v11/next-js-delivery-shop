"use client";

import { useState } from "react";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { Category } from "../../../_types";
import { CategorySelectProps } from "../../_types";

import { Check, ChevronDown } from "lucide-react";

const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { categories } = useArticleCategoriesStore();

  const selectedCategory = categories.find((c) => c._id === value);

  const handleSelect = (category: Category): void => {
    onChange(category._id, category.name, category.slug);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Категория статьи *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:outline-none 
          focus:ring-3 focus:ring-primary/20 focus:border-primary duration-300 text-left flex 
          justify-between items-center"
        >
          <span
            className={selectedCategory ? "text-gray-900" : "text-gray-500"}
          >
            {selectedCategory ? selectedCategory.name : "Выберите категорию"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div
            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg 
          max-h-60 overflow-auto"
          >
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleSelect(category)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
              >
                <span>{category.name}</span>
                {value === category._id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
      {selectedCategory && (
        <div className="mt-2 text-sm text-gray-600">
          <p>
            Slug категории:{" "}
            <code className="bg-gray-100 px-1 rounded">
              {selectedCategory.slug}
            </code>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            URL статьи будет: /blog/{selectedCategory.slug}/[slug-статьи]
          </p>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
