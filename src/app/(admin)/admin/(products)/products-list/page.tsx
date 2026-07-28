"use client";

import { useCallback, useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { ProductCardProps } from "@/types/product";

import SearchHeader from "./_components/SearchHeader";
import SearchInput from "./_components/SearchInput";
import SearchStates from "./_components/SearchStates";
import ProductSearchResult from "./_components/ProductSearchResult";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal";

interface DeleteModalState {
  isOpen: boolean;
  productId: number | null;
  productTitle: string;
}

const ProductsListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    productId: null,
    productTitle: "",
  });
  const modalRef = useClickOutsideModal<HTMLDivElement>(() =>
    setDeleteModal({ isOpen: false, productId: null, productTitle: "" }),
  );

  const fetchProducts = useCallback(
    async (searchQuery: string): Promise<void> => {
      if (!searchQuery.trim()) {
        setHasSearched(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/products/search-products?query=${encodeURIComponent(searchQuery)}`,
        );
        if (!response.ok)
          throw new Error("Не удалось запросить продукты по поиску");

        const products: ProductCardProps[] = await response.json();
        setProducts(products || []);
      } catch (e) {
        console.error("Ошибка при поиске продуктов: ", e);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    },
    [],
  );

  const handleSearch = (): void => {
    if (searchTerm.trim().length >= 3) fetchProducts(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && searchTerm.trim().length >= 3) handleSearch();
  };

  const handleClearResult = (): void => {
    setSearchTerm("");
    setHasSearched(false);
    setProducts([]);
  };

  const handleOpenDeleteModal = (
    productId: number,
    productTitle: string,
  ): void => {
    setDeleteModal({ isOpen: true, productId, productTitle });
  };

  const handleCloseDeleteModal = (): void => setDeleteModal({ isOpen: false, productId: null, productTitle: "" });

  const handleDeleteProduct = async (): Promise<void> => {
    if (!deleteModal.productId) {
      setDeleteModal({ isOpen: false, productId: null, productTitle: "" });
      alert('Нет ID продукта')
      return;
    }

    try {
      setDeletingId(deleteModal.productId);
      const response = await fetch(`/api/products/delete-product/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: deleteModal.productId }),
      });

      const deleteResult = await response.json();
      if (response.ok && deleteResult.success) {
        setProducts((prev) =>
          prev.filter((p) => p.id !== deleteModal.productId),
        );
        alert("Товар успешно удален");
      } else {
        alert(
          `Ошибка при удалении товара: ${deleteResult.error || "Неизвестная ошибка"}`,
        );
      }
    } catch (e) {
      alert("Произошла ошибка при удалении товара");
      console.error(e instanceof Error ? e.message : "Error deleting product");
    } finally {
      setDeletingId(null);
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <SearchHeader />
      <SearchInput
        searchTerm={searchTerm}
        isLoading={isLoading}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />
      <SearchStates hasSearched={hasSearched} isLoading={isLoading} />
      {hasSearched && !isLoading && (
        <ProductSearchResult
          products={products}
          deletingId={deletingId}
          onClearResults={handleClearResult}
          onOpenDeleteModal={handleOpenDeleteModal}
        />
      )}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteProduct}
        productTitle={deleteModal.productTitle}
        isDeleting={deletingId !== null}
        modalRef={modalRef}
      />
    </div>
  );
};

export default ProductsListPage;
