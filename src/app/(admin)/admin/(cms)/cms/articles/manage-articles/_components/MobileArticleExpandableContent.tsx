"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useArticleStore } from "@/store/articleStore";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { getStatusStyles } from "../_utils/getStatusStyles";

import { Article, ArticleStatus } from "@/types/entities";

import Link from "next/link";
import { Calendar, Check, ChevronDown, Edit, Eye, Star, User } from "lucide-react";

const MobileArticleExpandableContent = ({ article }: { article: Article }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { updateArticleStatus, updateArticleFeatured } = useArticleStore();

  const dropdownRef = useClickOutsideModal<HTMLDivElement>(() => setIsDropdownOpen(false));
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/cms/articles/editor?id=${article._id}`);
  };

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    setIsDropdownOpen(false);
    try {
      await updateArticleStatus(article._id.toString(), newStatus);
    } catch (error) {
      console.error("Ошибка изменения статуса:", error);
    }
  };

  const handleFeaturedToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateArticleFeatured(article._id.toString(), !article.isFeatured);
    } catch (error) {
      console.error("Ошибка изменения избранности:", error);
    }
  };


  const statusInfo = getStatusStyles(article.status);
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleFeaturedToggle}
          title={article.isFeatured ? "Убрать из избранного" : "Добавить в избранное"}
          className={`flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-colors duration-200 ${
            article.isFeatured
              ? "bg-yellow-50 hover:bg-yellow-100"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Star
            className={`w-5 h-5 ${
              article.isFeatured
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">
              {article.views}
            </span>
          </div>
          <span className="text-xs text-gray-500">просмотров</span>
        </div>
        <div ref={dropdownRef} className="relative" >
          <button
            title={`Статус: ${statusInfo.label}`}
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer 
            transition-colors duration-200 ${statusInfo.className}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <span className="text-xs font-medium">{statusInfo.label}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 min-w-35 border border-gray-200 rounded-lg shadow-lg bg-white z-10">
              {(
                ["published", "draft", "archived", "deleted"] as ArticleStatus[]
              ).map((status) => {
                const statusStyle = getStatusStyles(status);
                return (
                  <button
                    key={status}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors ${
                      article.status === status ? "bg-gray-50" : ""
                    } ${statusStyle.className}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                  >
                    <span>{statusStyle.label}</span>
                    {article.status === status && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Автор</span>
          </div>
          <div className="text-sm font-semibold text-gray-900 truncate">
            {article.author || <span className="text-gray-500">Не указан</span>}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Создана</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formattedDate}
          </div>
        </div>
      </div>
      <div className="flex gap-5 pt-2 justify-center">
        {article.status !== "deleted" && (
          <button
          title="Редактировать статью"
            onClick={handleEdit}
            className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-lg 
            hover:bg-green-700 cursor-pointer transition-colors duration-300 shadow-sm hover:shadow"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {article.status === "published" && (
          <Link
            href={`/blog/${article.categorySlug}/${article.slug}`}
            title="Просмотреть статью на сайте"
            target="_blank"
            className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 cursor-pointer transition-colors duration-300 shadow-sm hover:shadow"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileArticleExpandableContent;
