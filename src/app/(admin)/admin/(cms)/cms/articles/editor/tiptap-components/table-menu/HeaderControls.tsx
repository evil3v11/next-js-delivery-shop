import { Columns, Rows, Square } from "lucide-react";

interface HeaderControlsProps {
  hasHeaderRow: boolean;
  hasHeaderColumn: boolean;
  isHeaderCell: boolean;
  isCellSelected: boolean;
  onToggleHeaderRow: () => void;
  onToggleHeaderColumn: () => void;
  onToggleHeaderCell: () => void;
}

const HeaderControls = ({
  hasHeaderRow,
  hasHeaderColumn,
  isHeaderCell,
  isCellSelected,
  onToggleHeaderRow,
  onToggleHeaderColumn,
  onToggleHeaderCell,
}: HeaderControlsProps) => (
  <div className="table-button-group">
    <button
      type="button"
      onClick={onToggleHeaderRow}
      title="Строка заголовка"
      className={`table-menu-button ${hasHeaderRow ? "active" : ""}`}
    >
      <Rows className="w-4 h-4" />
    </button>
    <button
      type="button"
      onClick={onToggleHeaderColumn}
      title="Столбец заголовка"
      className={`table-menu-button ${hasHeaderColumn ? "active" : ""}`}
    >
      <Columns className="w-4 h-4" />
    </button>
    <button
      type="button"
      onClick={onToggleHeaderCell}
      disabled={!isCellSelected}
      title={isCellSelected ? "Сделать ячейку заголовком" : "Выделите ячейку"}
      className={`table-menu-button ${isHeaderCell ? "active" : ""} ${
        !isCellSelected ? "disabled" : ""
      }`}
    >
      <Square className="w-4 h-4" />
    </button>
  </div>
);

export default HeaderControls;
