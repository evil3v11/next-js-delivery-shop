import { Quote } from "lucide-react";
import { EditorProps } from "../../_types";

const QuoteButton = ({ editor }: EditorProps) => {
  if (!editor) return null;

  const handleQuoteToggle = (): void => {
    editor.chain().focus().toggleBlockquote().run();
  };

  const isActive = editor.isActive("blockquote");

  return (
    <button
      type="button"
      title="Цитата (Ctrl+Shift+B)"
      onClick={handleQuoteToggle}
      className={`
        p-2 rounded duration-300 cursor-pointer
        ${
          isActive
            ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Quote className="w-4 h-4" />
    </button>
  );
};

export default QuoteButton;
