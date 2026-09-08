"use client";

import { useEffect, useState } from "react";
import { useCardsStore } from "@/store/cardsStore";

import type { Card } from "./_types";

import ItemsPerPageSelector from "../_components/ItemsPerPageSelector";
import AddCardForm from "./_components/AddCardForm";
import CardTable from "./_components/CardTable";
import FilterBar from "./_components/FilterBar";
import CMSPagination from "../_components/AdminPagination";

const LoyaltyCardManagementPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    cards,
    totalPages,
    isLoading,
    currentPage,
    currentFilter,
    searchCardNumber,
    searchOwner,
    itemsPerPage,
    setCurrentFilter,
    setSearchCardNumber,
    setSearchOwner,
    setCurrentPage,
    setItemsPerPage,
    getCardsWithPagination,
  } = useCardsStore();
  const [tempSearchCardNumber, setTempSearchCardNumber] = useState(searchCardNumber);
  const [tempSearchOwner, setTempSearchOwner] = useState(searchOwner);
  const [tempFilter, setTempFilter] = useState(currentFilter);

  useEffect(() => {
    getCardsWithPagination({
      page: currentPage,
      limit: itemsPerPage,
      filter: currentFilter,
      searchCardNumber,
      searchOwner,
    });
  }, [
    currentPage,
    currentFilter,
    searchCardNumber,
    searchOwner,
    itemsPerPage,
    getCardsWithPagination,
  ]);

  const handleApplyFilters = () => {
    setCurrentFilter(tempFilter);
    setSearchCardNumber(tempSearchCardNumber);
    setSearchOwner(tempSearchOwner);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempFilter("all");
    setTempSearchCardNumber("");
    setTempSearchOwner("");
    setCurrentFilter("all");
    setSearchCardNumber("");
    setSearchOwner("");
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleAddCard = async (cleanedCardNumber: string) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cardNumber: cleanedCardNumber }),
      });

      const { success, message } = await response.json();

      if (!response.ok || !success) {
        setError(message);
        return;
      }

      setSuccess(message);
      getCardsWithPagination({
        filter: currentFilter,
        searchCardNumber,
        searchOwner,
        page: currentPage,
        limit: itemsPerPage,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (card: Card) => {
    const action = card.isActive ? "deactivate" : "activate";
    const message = card.isActive
      ? "Деактивировать карту? Она станет недоступна для использования."
      : "Активировать карту? Она станет доступна для использования.";

    if (!confirm(message)) return;

    try {
      const response = await fetch(
        `/api/admin/cards?cardNumber=${card.cardNumber}&action=${action}`,
        { method: "PATCH" },
      );

      const { success, message } = await response.json();

      if (!response.ok || !success) {
        setError(message);
        return;
      }

      setSuccess(message);
      getCardsWithPagination({
        filter: currentFilter,
        searchCardNumber,
        searchOwner,
        page: currentPage,
        limit: itemsPerPage,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    }
  };

  const handleDelete = async (card: Card) => {
    const warning = card.owner
      ? "Карта привязана к пользователю! Удалить всё равно? Это действие необратимо."
      : "Удалить карту из системы? Это действие необратимо.";

    if (!confirm(warning)) return;

    try {
      const response = await fetch(
        `/api/admin/cards?cardNumber=${card.cardNumber}`,
        {
          method: "DELETE",
        },
      );

      const { success, message } = await response.json();

      if (!response.ok || !success) {
        setError(message);
        return;
      }

      setSuccess("Карта удалена");
      getCardsWithPagination({
        filter: currentFilter,
        searchCardNumber,
        searchOwner,
        page: currentPage,
        limit: itemsPerPage,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Управление картами лояльности</h1>
      <AddCardForm
        onSubmit={handleAddCard}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
        onErrorChange={setError}
        onSuccessChange={setSuccess}
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <FilterBar
          tempFilter={tempFilter}
          tempSearchCardNumber={tempSearchCardNumber}
          tempSearchOwner={tempSearchOwner}
          onTempFilterChange={setTempFilter}
          onTempSearchCardNumberChange={setTempSearchCardNumber}
          onTempSearchOwnerChange={setTempSearchOwner}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        {isLoading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : cards.length === 0 ? (
          <p className="text-gray-500">Карты не найдены</p>
        ) : (
          <>
            <CardTable
              cards={cards}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
            {totalPages > 1 && <CMSPagination type="cards" />}
          </>
        )}
      </div>
    </div>
  );
};

export default LoyaltyCardManagementPage;
