'use client'

import { AlertTriangle, Loader, Trash2 } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
  isDeleting,
  modalRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productTitle: string;
  isDeleting: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#fcd5bacc]
    text-main-text px-3 backdrop-blur-sm h-full"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded shadow-auth-form max-h-[calc(100vh-80px)] max-w-2xl 
      flex flex-col px-6"
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Подтверждение удаления</h3>
          <p className="text-gray-600 mb-4">
            Вы уверены, что хотите удалить товар{" "}
            <strong>&quot;{productTitle}&quot;</strong>?
          </p>
          <div className="flex flex-col items-center gap-2 text-sm text-red-600 mb-6">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>
              Это действие нельзя отменить! Товар будет полностью удален из
              системы.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 
              cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 
              flex items-center gap-2 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Удалить
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
