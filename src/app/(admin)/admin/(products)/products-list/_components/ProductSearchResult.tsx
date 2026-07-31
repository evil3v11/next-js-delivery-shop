"use client";

import { ProductCardProps } from "@/types/product";

import { TRANSLATIONS } from "@/utils/translations";

import { buttonStyles } from "@/app/styles";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProductSearchResultProps {
  products: ProductCardProps[];
  deletingId: number | null;
  onClearResults: () => void;
  onOpenDeleteModal: (productId: number, productTitle: string) => void;
}

const ProductSearchResult = ({
  products,
  deletingId,
  onClearResults,
  onOpenDeleteModal,
}: ProductSearchResultProps) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <p className="text-main-text">Найдено товаров: {products.length}</p>
        {products.length > 0 && (
          <button
            onClick={onClearResults}
            className={`${buttonStyles.active} px-4 py-2 text-sm text-white cursor-pointer 
            hover:shadow-article active:shadow-button-active`}
          >
            Очистить результаты
          </button>
        )}
      </div>
      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Товары не найдены</p>
            <p className="text-sm">Попробуйте изменить поисковый запрос</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 flex justify-between items-center w-full gap-x-2"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                  <p>Артикул: {product.article}</p>
                  <p>Цена: {product.basePrice} руб.</p>
                  <p>Остаток: {product.quantity} шт.</p>
                  <p>
                    Категории:{" "}
                    {product.categories
                      .map((cat) => TRANSLATIONS[cat] || cat)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <Link
                  href={`/admin/edit-product/${product.id}`}
                  className="bg-primary hover:shadow-button-default active:shadow-button-active rounded 
                  text-white cursor-pointer duration-300 px-4 py-2 flex flex-row gap-2 items-center 
                  justify-center text-xs md:text-base"
                >
                  <Edit size={16} />
                  Изменить
                </Link>
                <button
                  onClick={() => onOpenDeleteModal(product.id, product.title)}
                  disabled={deletingId === product.id}
                  className="bg-[#d80000] text-white px-4 py-2 rounded flex items-center gap-2 
                  disabled:opacity-50 cursor-pointer text-xs md:text-base"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductSearchResult;
