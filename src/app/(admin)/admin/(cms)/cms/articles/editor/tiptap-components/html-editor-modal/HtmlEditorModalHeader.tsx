import { Check, Copy, X } from "lucide-react";

interface HtmlEditorModalHeaderProps {
  htmlContent: string;
  isCopied: boolean;
  handleCopy: () => void;
  onCloseAction: () => void;
}

const HtmlEditorModalHeader = ({
  htmlContent,
  isCopied,
  handleCopy,
  onCloseAction,
}: HtmlEditorModalHeaderProps) => {
  return (
    <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-white">HTML редактор</h3>
        <p className="text-sm text-gray-400 mt-1">
          Редактирование с поддержкой инлайн-стилей
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {htmlContent.length} символов
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm duration-300 cursor-pointer ${
            isCopied
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Копировать
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCloseAction}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg duration-300 cursor-pointer"
          title="Закрыть (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HtmlEditorModalHeader;
