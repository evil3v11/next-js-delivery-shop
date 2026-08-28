import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import type * as monaco from "monaco-editor";

import type { EditorProps } from "../../_types";

interface UseHtmlEditorDependencies extends EditorProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export const useHtmlEditor = ({
  editor,
  isOpen,
  onCloseAction,
}: UseHtmlEditorDependencies) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const modalRef = useClickOutsideModal<HTMLDivElement>(onCloseAction);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleUpdate = useCallback((): void => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setContent(htmlContent, { parseOptions: { preserveWhitespace: "full" } })
      .run();
    onCloseAction();
  }, [editor, htmlContent, onCloseAction]);

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === "Escape") onCloseAction();
    },
    [onCloseAction],
  );

  const handleSave = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleUpdate();
      }
    },
    [handleUpdate],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("keydown", handleSave);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.removeEventListener("keydown", handleSave);
      };
    }
  }, [isOpen, handleEscapeKey, handleSave]);

  useEffect(() => {
    if (isOpen && editor) {
      const html = editor.getHTML();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHtmlContent(html);
    }
  }, [editor, isOpen]);

  useEffect(() => {
    return () => {
      editorRef.current = null;
    };
  }, []);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error("Не удалось скопировать: ", e);
    }
  };

  const handleEditorChange = (value: string | undefined) => setHtmlContent(value || "");

  const handleEditorDidMount = useCallback((
    editorInstance: monaco.editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editorInstance;

    editorInstance.focus();
    const model = editorInstance.getModel();
    
    if (!model) return

    const lastLine = model.getLineCount();
    const lastColumn = model.getLineLength(lastLine) + 1;
    editorInstance.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: lastLine,
      endColumn: lastColumn,
    });
  }, []);

  const handleBeforeMount = useCallback((monacoInstance: typeof monaco) => {
    monacoInstance.editor.defineTheme("dark-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "tag", foreground: "569cd6" },
        { token: "attribute.name", foreground: "9cdcfe" },
        { token: "attribute.value", foreground: "ce9178" },
      ],
      colors: {
        "editor.background": "#111827",
        "editor.foreground": "#e5e7eb",
        "editor.lineHighlightBackground": "#1f2937",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorCursor.foreground": "#ffffff",
        "editor.selectionBackground": "#374151",
        "editor.selectionHighlightBackground": "#1e3a8a",
        "editorIndentGuide.background": "#374151",
        "editorIndentGuide.activeBackground": "#4b5563",
      },
    });
  }, []);

  return {
    modalRef,
    editorRef,
    previewRef,
    htmlContent,
    isCopied,
    handleCopy,
    handleUpdate,
    handleEditorChange,
    handleEditorDidMount,
    handleBeforeMount,
  };
};
