import { useHtmlEditor } from "../../_hooks/useHtmlEditor";
import { HtmlEditorProps } from "../../../_types";

import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";
import "../../_styles/html-preview.css";

import HtmlEditorModalFooter from "./HtmlEditorModalFooter";
import HtmlEditorModalHeader from "./HtmlEditorModalHeader";
import HtmlEditorModalRedactor from "./HtmlEditorModalRedactor";
import HtmlEditorModalShowcase from "./HtmlEditorModalShowcase";

const HtmlEditorModal = ({
  editor,
  isOpen,
  onCloseAction,
}: HtmlEditorProps) => {
  const {
    modalRef,
    preRef,
    textAreaRef,
    previewRef,
    highlightedHtml,
    htmlContent,
    isCopied,
    handleCopy,
    handleUpdate,
    handleTextAreaChange,
    handleTextAreaKeyDown,
  } = useHtmlEditor({ editor, isOpen, onCloseAction });

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) =>
        e.target === e.currentTarget ? onCloseAction() : () => {}
      }
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl border border-gray-800 
      overflow-hidden max-h-[90vh] flex flex-col"
      >
        <HtmlEditorModalHeader
          htmlContent={htmlContent}
          isCopied={isCopied}
          handleCopy={handleCopy}
          onCloseAction={onCloseAction}
        />
        <div className="flex-1 overflow-hidden grid grid-cols-2">
          <HtmlEditorModalRedactor
            preRef={preRef}
            textAreaRef={textAreaRef}
            highlightedHtml={highlightedHtml}
            htmlContent={htmlContent}
            handleTextAreaChange={handleTextAreaChange}
            handleTextAreaKeyDown={handleTextAreaKeyDown}
          />
          <HtmlEditorModalShowcase
            previewRef={previewRef}
            htmlContent={htmlContent}
          />
        </div>
        <HtmlEditorModalFooter
          htmlContent={htmlContent}
          onCloseAction={onCloseAction}
          handleUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default HtmlEditorModal;
