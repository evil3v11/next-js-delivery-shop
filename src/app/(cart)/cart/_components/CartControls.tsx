"use client";

interface CartControlsProps {
  areAllItemsSelected: boolean;
  selectedItemsCount: number;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onRemoveSelected: () => void;
}

const CartControls = ({
  areAllItemsSelected,
  selectedItemsCount,
  onSelectAll,
  onUnselectAll,
  onRemoveSelected,
}: CartControlsProps) => {
  return (
    <div className="flex items-center gap-x-10 mb-4 xl:mb-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={areAllItemsSelected}
          onChange={(e) => (e.target.checked ? onSelectAll() : onUnselectAll())}
          className="hidden"
        />
        <div className="w-6 h-6 bg-primary border border-[#f3f2f1] rounded flex items-center justify-center duration-300">
          {areAllItemsSelected ? (
            <div className="w-3.75 h-px bg-white" />
          ) : (
            <div className="relative w-3.75 h-3.75">
              <div className="absolute top-1/2 left-0 w-full h-px bg-white transform -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 w-px h-full bg-white transform -translate-x-1/2" />
            </div>
          )}
        </div>
        <span className="text-xs">Выделить все</span>
      </label>
      {selectedItemsCount > 0 && (
        <button
          onClick={onRemoveSelected}
          className="text-secondary hover:underline text-xs cursor-pointer"
        >
          Удалить выбранные
        </button>
      )}
    </div>
  );
};

export default CartControls;
