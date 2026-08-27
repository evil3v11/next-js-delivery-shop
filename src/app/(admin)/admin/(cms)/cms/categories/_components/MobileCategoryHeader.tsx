import type { MobileCategoryHeaderProps } from "../_types";

const MobileCategoryHeader = ({
  category,
  displayNumericId,
}: MobileCategoryHeaderProps) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <span
        title="Порядковый номер"
        className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-medium shrink-0"
      >
        {displayNumericId || "—"}
      </span>
      <h3
        title={category.name}
        className="font-medium text-gray-900 text-lg wrap-break-word"
      >
        {category.name}
      </h3>
    </div>
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <code
        title="Ссылка (slug)"
        className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all"
      >
        {category.slug}
      </code>
      <span
        title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString("ru-RU")}`}
        className="text-xs text-gray-500 shrink-0"
      >
        {new Date(category.createdAt).toLocaleDateString("ru-RU")}
      </span>
    </div>
  </div>
);

export default MobileCategoryHeader;
