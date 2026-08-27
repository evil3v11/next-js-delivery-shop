import { EditorProps } from "../../_types";

import { Type } from "lucide-react";

const ParagraphButton = ({ editor }: EditorProps) => {
  const isActive = editor?.isActive("paragraph");

  if (!editor) return null;

  return (
    <button
      title="Обычный текст (Ctrl+Alt+0)"
      disabled={!editor.can().setParagraph()}
      onClick={() => editor.chain().focus().setParagraph().run()}
      className={`p-2 rounded duration-300 cursor-pointer ${
        isActive
          ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Type className="w-4 h-4" />
    </button>
  );
};

export default ParagraphButton;
