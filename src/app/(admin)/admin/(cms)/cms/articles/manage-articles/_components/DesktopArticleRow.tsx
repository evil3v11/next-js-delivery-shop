import { useState } from "react";
import { useRouter } from "next/navigation";
import { useArticleStore } from "@/store/articleStore";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { getStatusStyles } from "../_utils/getStatusStyles";

import { ArticleStatus } from "@/types/entities";
import { MobileArticleCardProps } from "../_types";

import { Check, ChevronDown, Edit, Eye, Star } from "lucide-react";
import Link from "next/link";
import DragElement from "../../../_components/DragElement";

export const DesktopArticleRow = ({
  article,
  displayNumericId,
  isBeingDragged = false,
}: MobileArticleCardProps) => {
  const { updateArticleStatus, updateArticleFeatured } = useArticleStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useClickOutsideModal<HTMLDivElement>(() =>
    setIsDropdownOpen(false),
  );

  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/cms/articles/editor?id=${article._id}`);
  };

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    setIsDropdownOpen(false);
    try {
      await updateArticleStatus(String(article._id), newStatus);
    } catch (error) {
      console.error("Ошибка изменения статуса статьи: ", error);
    }
  };

  const handleFeaturedToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateArticleFeatured(String(article._id), !article.isFeatured);
    } catch (error) {
      console.error("Ошибка изменения избранности статьи: ", error);
    }
  };

  const statusInfo = getStatusStyles(article.status);

  return (
    <div
      className={`p-4 hover:bg-gray-50 text-sm duration-200 ${
        isBeingDragged
          ? "opacity-60 bg-linear-to-r from-blue-50 to-green-50 shadow-lg border-2 border-green-400 transform scale-[0.995]"
          : "hover:shadow-sm"
      }`}
    >
      <div className="grid lg:grid-cols-[32px_56px_100px_100px_100px_56px_128px_80px_80px_40px_100px] 
      xl:grid-cols-[32px_56px_170px_150px_150px_56px_128px_100px_120px_50px_100px] gap-2 items-center 
      justify-between">
        <div>
          <DragElement />
        </div>
        <div className="flex justify-center">
          <span
            title="Порядковый номер"
            className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs 
            font-medium shrink-0"
          >
            {displayNumericId || "-"}
          </span>
        </div>
        <div className="min-w-0">
          <div
            title={article.name}
            className="text-xs text-main-text wrap-break-words"
          >
            {article.name}
          </div>
        </div>
        <div className="min-w-0">
          <div
            title={`Ссылка: ${article.slug}`}
            className="text-xs bg-gray-100 px-2 py-1 rounded break-all font-mono"
          >
            {article.slug}
          </div>
        </div>
        <div className="min-w-0">
          <div
            title={`Категория: ${article.categoryName}`}
            className="text-xs bg-gray-100 px-2 py-1 rounded break-all font-mono"
          >
            {article.categoryName}
          </div>
        </div>
        <div className="min-w-0 mx-auto">
          <button
            onClick={handleFeaturedToggle}
            className={`text-xs px-2 py-1 rounded break-all font-mono flex items-center justify-center w-8 
            cursor-pointer transition-colors ${article.isFeatured
              ? "bg-yellow-50 hover:bg-yellow-100"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
            title={
              article.isFeatured
                ? "Убрать из избранного"
                : "Добавить в избранное"
            }
          >
            <Star
              className={`w-4 h-4 ${
                article.isFeatured
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div ref={dropdownRef} className="min-w-0 relative" >
          <div
            title={`Статус: ${statusInfo.label}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`text-xs px-2 py-1 rounded break-all font-mono border cursor-pointer flex items-center 
            justify-between ${statusInfo.className}`}
          >
            <span>{statusInfo.label}</span>
            <ChevronDown
              className={`w-3 h-3 ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 border border-gray-200 rounded shadow-lg z-10 
            flex items-stretch justify-between">
              <div className="w-full">
                {(
                  [
                    "published",
                    "draft",
                    "archived",
                    "deleted",
                  ] as ArticleStatus[]
                ).map((status) => {
                  const statusStyle = getStatusStyles(status);
                  return (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(status);
                      }}
                      className={`flex flex-1 items-center justify-between w-full px-3 py-2 text-xs text-left 
                      hover:bg-gray-50 cursor-pointer ${statusStyle.className}`}
                    >
                      <span>{statusStyle.label}</span>
                      {article.status === status && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0 flex justify-center">
          <div
            title={article.author || "Автор неизвестен"}
            className="text-gray-600 text-xs wrap-break-word text-center"
          >
            {article.author || <span className="text-gray-400">—</span>}
          </div>
        </div>
        <div className="min-w-0">
          <div
            title={`Дата создания: ${new Date(article.createdAt).toLocaleDateString("ru-RU")}`}
            className="text-gray-600 text-xs wrap-break-word"
          >
            {new Date(article.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>
        <div className="min-w-0">
          <div
            title={`Просмотров: ${article.views}`}
            className="text-sm text-center px-2 py-1 rounded break-all font-mono"
          >
            {article.views}
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex gap-2 justify-center">
            {article.status !== "deleted" && (
              <button
                onClick={handleEdit}
                title="Редактировать статью"
                className="p-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center 
                cursor-pointer duration-300 shrink-0"
              >
                <Edit className="w-3 h-3" />
              </button>
            )}
            {(article.status === "published" ||
              article.status === "archived") && (
              <Link
                href={`/blog/${article.categorySlug}/${article.slug}`}
                target="_blank"
                title="Просмотреть статью"
                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center 
                cursor-pointer duration-300 shrink-0"
              >
                <Eye className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
