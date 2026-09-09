import { ChevronLeft, ChevronRight, Columns, Minus, Plus } from "lucide-react";

interface ColumnControlsProps {
  onAddBefore: () => void;
  onAddAfter: () => void;
  onDelete: () => void;
}

const ColumnControls = ({
  onAddBefore,
  onAddAfter,
  onDelete,
}: ColumnControlsProps) => (
  <div className="table-button-group">
    <span className="table-group-label">Столбцы:</span>
    <button
      type="button"
      onClick={onAddBefore}
      className="table-menu-button"
      title="Добавить столбец слева"
    >
      <ChevronLeft className="w-3 h-3" />
      <Plus className="w-3 h-3" />
    </button>
    <button
      type="button"
      onClick={onAddAfter}
      className="table-menu-button"
      title="Добавить столбец справа"
    >
      <Plus className="w-3 h-3" />
      <ChevronRight className="w-3 h-3" />
    </button>
    <button
      type="button"
      onClick={onDelete}
      className="table-menu-button"
      title="Удалить столбец"
    >
      <Minus className="w-3 h-3" />
      <Columns className="w-3 h-3" />
    </button>
  </div>
);

export default ColumnControls;
