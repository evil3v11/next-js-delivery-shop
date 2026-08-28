import { useHtmlEditor } from "../../_hooks/useHtmlEditor";
import { HtmlEditorProps } from "../../../_types";

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
    previewRef,
    htmlContent,
    isCopied,
    handleCopy,
    handleUpdate,
    handleEditorChange,
    handleEditorDidMount,
    handleBeforeMount,
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
        <div className="overflow-hidden flex flex-col h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 flex-1 min-h-0">
            <HtmlEditorModalRedactor
              htmlContent={htmlContent}
              handleEditorChange={handleEditorChange}
              handleEditorDidMount={handleEditorDidMount}
              handleBeforeMount={handleBeforeMount}
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
    </div>
  );
};

export default HtmlEditorModal;
