"use client";

import Image from "next/image";

interface ConfirmAvatarModalProps {
  showConfirmModal: boolean;
  previewUrl: string;
  isUploading: boolean;
  confirmAvatarAction: () => void;
  cancelUploadAction: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

const ConfirmAvatarModal = ({
  showConfirmModal,
  previewUrl,
  isUploading,
  confirmAvatarAction,
  cancelUploadAction,
  ref,
}: ConfirmAvatarModalProps) => {
  if (!showConfirmModal) return null;

  return (
    <div
      className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-center items-center backdrop-blur-lg 
      rounded-lg z-50 shadow-catalog-menu"
    >
      <div
        ref={ref}
        className="flex flex-col gap-y-10 text-black items-center p-5 text-center bg-white rounded"
      >
        <h3 className="text-2xl font-bold ">Подтверждение смены аватара</h3>
        <div className="mx-auto">
          <Image
            src={previewUrl}
            alt="Превью аватара"
            width={100}
            height={100}
            className="rounded-full object-cover w-25 h-25"
          />
        </div>
        <p>
          Вы уверены, что хотите сменить аватар? Старое изображение будет
          удалено
        </p>
        <div className="flex flex-col gap-y-5 xl:flex-row xl:gap-x-5 w-full">
          <button
            onClick={confirmAvatarAction}
            disabled={isUploading}
            className="flex-1 bg-primary hover:bg-primary/80 rounded py-2 cursor-pointer 
              duration-300 shadow-button-default active:shadow-button-active text-white"
          >
            {isUploading ? "Загрузка..." : "Сменить аватар"}
          </button>
          <button
            onClick={cancelUploadAction}
            disabled={isUploading}
            className="flex-1 bg-gray-400 hover:bg-gray-200 rounded py-2 cursor-pointer 
              duration-300 shadow-button-default active:shadow-button-active text-white hover:text-gray-600"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAvatarModal;
