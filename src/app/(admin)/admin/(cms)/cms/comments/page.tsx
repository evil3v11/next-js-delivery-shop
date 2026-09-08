"use client";

import { useCallback, useEffect, useState } from "react";
import { useCommentsStore } from "@/store/commentsStore";

import { formatDateToString } from "@/utils/formatDateToString";

import CMSHeader from "../_components/CMSHeader";
import ItemsPerPageSelector from "../_components/ItemsPerPageSelector";
import CommentsTableHeader from "./_components/CommentsTableHeader";
import CommentsList from "./_components/CommentsList";
import CMSPagination from "../_components/CMSPagination";
import CommentsFilters from "./_components/CommentsFilters";

const CommentsManagementPage = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [articleFilter, setArticleFilter] = useState("");

  const {
    comments,
    totalPages,
    currentPage,
    isLoading,
    totalAllItems,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    fetchCommentsWithPagination,
  } = useCommentsStore();

  useEffect(() => {
    fetchCommentsWithPagination({
      page: String(currentPage),
      dateFrom,
      dateTo,
      author: authorFilter,
      article: articleFilter,
    });
  }, [
    fetchCommentsWithPagination,
    currentPage,
    dateFrom,
    dateTo,
    authorFilter,
    articleFilter,
  ]);

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
    fetchCommentsWithPagination({ page: "1" });
  };

  const handleDeleteComment = useCallback(async (id: string) => {
    if (!confirm("Удалить комментарий?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/admin/cms/api/comments/${id}`, {
        method: "DELETE",
      });

      if (response.ok)
        fetchCommentsWithPagination({ page: String(currentPage) });
    } catch (e) {
      console.error(`Ошибка при удалении комментария: ${e}`);
    } finally {
      setDeletingId(null);
    }
  }, [currentPage, fetchCommentsWithPagination]);

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
    setCurrentPage(1);
    setActiveFilter("");
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
    setCurrentPage(1);
    setActiveFilter("");
  };

  const getTodayDate = () => formatDateToString(new Date());
  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDateToString(date);
  };

  const setToday = () => {
    const today = getTodayDate();
    setDateFrom(today);
    setDateTo(today);
    setCurrentPage(1);
    setActiveFilter("today");
  };

  const setLast3Days = () => {
    setDateFrom(getDaysAgo(3));
    setDateTo(getTodayDate());
    setCurrentPage(1);
    setActiveFilter("3-days");
  };

  const setLastWeek = () => {
    setDateFrom(getDaysAgo(7));
    setDateTo(getTodayDate());
    setCurrentPage(1);
    setActiveFilter("week");
  };

  const setLastMonth = () => {
    setDateFrom(getDaysAgo(30));
    setDateTo(getTodayDate());
    setCurrentPage(1);
    setActiveFilter("month");
  };

  const applyFilters = (author: string, article: string) => {
    setAuthorFilter(author);
    setArticleFilter(article);
    setCurrentPage(1);
    fetchCommentsWithPagination({
      page: "1",
      dateFrom,
      dateTo,
      author,
      article,
    });
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setAuthorFilter("");
    setArticleFilter("");
    setCurrentPage(1);
    setActiveFilter("");
  };

  return (
    <div className="relative">
      <CMSHeader
        title="Управление комментариями"
        description={`Всего комментариев: ${totalAllItems}`}
      />
      <div className="mb-4">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
      </div>
      <CommentsFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        activeFilter={activeFilter}
        authorFilter={authorFilter}
        articleFilter={articleFilter}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onSetToday={setToday}
        onSetLast3Days={setLast3Days}
        onSetLastWeek={setLastWeek}
        onSetLastMonth={setLastMonth}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        getTodayDate={getTodayDate}
      />
      <CommentsTableHeader />
      <div className="border border-t-0 border-gray-200 rounded-b bg-white p-4">
        <CommentsList
          comments={comments}
          deletingId={deletingId}
          isLoading={isLoading}
          onDelete={handleDeleteComment}
        />
      </div>
      {totalPages > 1 && comments.length > 0 && (
        <CMSPagination type="comments" />
      )}
    </div>
  );
};

export default CommentsManagementPage;
