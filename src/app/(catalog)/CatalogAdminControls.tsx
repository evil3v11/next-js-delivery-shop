import { CatalogAdminControlsProps } from "@/types/catalogAdminControlsProps";

const CatalogAdminControls = ({
  isEditing,
  onToggleEditingAction,
  resetLayout,
}: CatalogAdminControlsProps) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onToggleEditingAction}
        className="text-sm md:text-base border border-primary text-primary hover:text-white 
            hover:bg-[#ff6633] hover:border-transparent active:shadow-button-active w-2/3 
              h-10 rounded p-2 justify-center items-center transition-all duration-300 
              cursor-pointer select-none"
      >
        {isEditing ? "Закончить редактировать" : "Изменить расположение"}
      </button>
      {isEditing && (
        <button
          onClick={resetLayout}
          className="ml-3 p-2 text-xs justify-center items-center active:shadow-button-active
                border-none rounded cursor-pointer transition-colors duration-300 bg-[#f3f2f1]
                hover:shadow-button-secondary"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

export default CatalogAdminControls;
