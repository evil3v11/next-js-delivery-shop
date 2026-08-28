import { Activity, useState } from "react";

import { EditorProps } from "../../_types";

import { FileCode } from "lucide-react";

import HtmlEditorModal from "./html-editor-modal/HtmlEditorModal";

const CodeEditorButton = ({ editor }: EditorProps) => {
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsHtmlModalOpen(true)}
        className="p-2 rounded duration-300 cursor-pointer text-gray-700 hover:bg-gray-100"
        title="Редактор HTML (Ctrl+Shift+H)"
      >
        <FileCode className="w-4 h-4" />
      </button>
      {/* <Activity mode={isHtmlModalOpen ? "visible" : "hidden"}> */}
      {isHtmlModalOpen && (
        <HtmlEditorModal
          editor={editor}
          isOpen={isHtmlModalOpen}
          onCloseAction={() => setIsHtmlModalOpen(false)}
        />
      )}
      {/* </Activity> */}
    </>
  );
};

export default CodeEditorButton;
