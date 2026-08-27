import { Save } from "lucide-react";

interface HtmlEditorModalFooter {
  htmlContent: string;
  onCloseAction: () => void;
  handleUpdate: () => void;
}

const HtmlEditorModalFooter = ({
  htmlContent,
  onCloseAction,
  handleUpdate,
}: HtmlEditorModalFooter) => {
  return (
    <div className="px-6 py-4 border-t border-gray-800 bg-gray-900">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium">Горячие клавиши:</span>
              <kbd className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs">
                Ctrl/Cmd + Enter
              </kbd>{" "}
              - сохранить
              <kbd className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs">
                Esc
              </kbd>{" "}
              - отмена
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCloseAction}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 
            rounded-lg duration-300 cursor-pointer"
          >
            Отмена (Esc)
          </button>
          <button
            type="button"
            title="Ctrl+Enter"
            onClick={handleUpdate}
            disabled={!htmlContent.trim()}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 duration-300 
            cursor-pointer ${
              htmlContent.trim()
                ? "bg-[#9674F9] text-white hover:bg-[#8563e8]"
                : "bg-gray-800 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Сохранить (Ctrl+Enter)
          </button>
        </div>
      </div>
    </div>
  );
};

export default HtmlEditorModalFooter;
