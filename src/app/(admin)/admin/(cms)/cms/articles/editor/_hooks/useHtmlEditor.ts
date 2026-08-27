import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { highlight, languages } from "prismjs";

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
  const preRef = useRef<HTMLPreElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
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

      const timer = setTimeout(() => {
        textAreaRef.current?.focus();
        textAreaRef.current?.select();
      });

      return () => clearTimeout(timer);
    }
  }, [editor, isOpen]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    const pre = preRef.current;

    if (!textarea || !pre) return;

    const handleScroll = (): void => {
      textarea.scrollTop = pre.scrollTop;
      textarea.scrollLeft = pre.scrollLeft;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.addEventListener("scroll", handleScroll);
  }, []);

  const handleTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => setHtmlContent(e.target.value);

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (e.key === "Escape") {
      onCloseAction();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleUpdate();
    }
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error("Не удалось скопировать: ", e);
    }
  };

  const getHighlightedHtml = (): string => {
    if (!htmlContent) return "";
    try {
      return highlight(htmlContent, languages.markup, "html");
    } catch (e) {
      console.error("Не удалось подсветить: ", e);
      return htmlContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  };

  const highlightedHtml = getHighlightedHtml();

  return {
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
  };
};
