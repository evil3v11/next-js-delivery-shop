"use client";

import { useEffect, useState } from "react";

import { formStyles } from "@/app/(auth)/styles";

import MiniLoader from "@/components/MiniLoader";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface ProductCategoriesProps {
  selectedCategories: string[];
  onCategoriesChange: (category: string[]) => void;
}

const ProductCategories = ({
  selectedCategories,
  onCategoriesChange,
}: ProductCategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("null");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/catalog");
        if (!response.ok)
          throw new Error(
            "Ошибка ответа сервера: ",
            response.status as ErrorOptions,
          );

        const data = await response.json();
        setCategories(data);
      } catch {
        setError("Не удалось загрузить категории");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlugs = Array.from(e.target.selectedOptions).map((op) => op.value);
    onCategoriesChange(selectedSlugs);
  };

  if (isLoading) return <MiniLoader />;

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">
          Категории <span className="text-[#d80000]">*</span>
        </label>
        <div className="text-sm text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Категории <span className="text-[#d80000]">*</span>
      </label>
      <select
        multiple
        value={selectedCategories}
        onChange={handleCategoryChange}
        className={`${formStyles.input} bg-white [&&]:w-full [&&]:h-32`}
        required
      >
        {categories.map((category) => (
          <option key={category._id} value={category.slug}>
            {category.title}
          </option>
        ))}
      </select>
      <div className="mt-2 text-sm text-gray-600">
        Для выбора нескольких категорий удерживайте Ctrl (Cmd на Mac)
      </div>
      {selectedCategories.length > 0 && (
        <div className="mt-3">
          <span className="text-sm font-medium">Выбранные категории: </span>
          <span className="text-sm text-gray-600">
            {selectedCategories.length} шт.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
