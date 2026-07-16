"use client";

interface PhoneEditViewProps {
  isLoading: boolean;
  onSaveAction?: () => void;
  onCancelAction: () => void;
  isSendingOtp?: boolean;
  isVerificationMode?: boolean;
}

const PhoneEditView = ({
  isLoading,
  onSaveAction,
  onCancelAction,
  isSendingOtp,
  isVerificationMode,
}: PhoneEditViewProps) => {
  return (
    <div className="flex justify-center gap-x-5 w-full">
      {!isVerificationMode && onSaveAction && (
        <button
          onClick={onSaveAction}
          disabled={isLoading || isSendingOtp}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded cursor-pointer 
        duration-300 flex-1"
        >
          {isLoading
            ? "Сохранение..."
            : isSendingOtp
              ? "Оправление..."
              : "Сохранить"}
        </button>
      )}
      <button
        onClick={onCancelAction}
        className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-pointer 
        duration-300 flex-1"
      >
        Отмена
      </button>
    </div>
  );
};

export default PhoneEditView;
