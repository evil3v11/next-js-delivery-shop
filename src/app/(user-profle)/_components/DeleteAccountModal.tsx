"use client";

const DeleteAccountModal = ({
  modalRef,
  closeModal,
  deleteAccountAction,
}: {
  modalRef: React.RefObject<HTMLDivElement | null>;
  closeModal: () => void;
  deleteAccountAction: () => void;
}) => {
  return (
    <div
      ref={modalRef}
      className="absolute inset-0 flex flex-col justify-center items-center rounded-lg bg-[#fcd5bacc] 
      backdrop-blur-sm p-5"
    >
      <div className="bg-white p-10 rounded space-y-5">
        <h2 className="text-xl font-bold text-center">Подтверждение удаления</h2>
        <p className="text-center">
          Вы уверены, что хотите удалить свой аккаунт?
          <br />
          <br />
          Это действие нельзя отменить.
        </p>
        <div className="flex justify-between gap-x-5">
          <button
            onClick={closeModal}
            className="cursor-pointer w-full py-2 rounded bg-gray-200 hover:bg-gray-400 text-black duration-300"
          >
            Отмена
          </button>
          <button
            onClick={deleteAccountAction}
            className="cursor-pointer w-full py-2 rounded bg-red-400 hover:bg-red-600 text-white duration-300"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
