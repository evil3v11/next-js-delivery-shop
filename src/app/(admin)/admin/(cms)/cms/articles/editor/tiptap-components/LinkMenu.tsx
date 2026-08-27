"use client";

import { useEffect, useRef, useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { EditorProps } from "../../_types";

import { ExternalLink, LinkIcon, Unlink } from "lucide-react";

const LinkMenu = ({ editor }: EditorProps) => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const urlInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useClickOutsideModal<HTMLDivElement>(() => setIsModalOpen);

  useEffect(() => {
    if (!editor) return;

    if (isModalOpen && editor.isActive("link")) {
      const attributes = editor.getAttributes("link");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(attributes.href || "");
      setIsModalOpen(attributes.target === "_blank");
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
        ) || "",
      );
    } else if (isModalOpen) {
      setUrl("");
      setIsModalOpen(true);
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
        ) || "",
      );
    }
  }, [editor, isModalOpen]);

  if (!editor) return null;

  const handleOpenModal = (): void => setIsModalOpen(true);
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setUrl("");
    setText("");
    setOpenInNewTab(true);
  };

  const handleAddLink = (): void => {
    if (!editor || !url.trim()) return;

    const linkAttributes = {
      href: url,
      target: openInNewTab ? "_blank" : null,
      rel: openInNewTab ? "noopener noreferrer" : null,
    };

    if (editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink(linkAttributes)
        .run();
    } else {
      if (text) editor.chain().focus().setLink(linkAttributes).run();
      else
        editor.chain().focus().setLink(linkAttributes).insertContent(url).run();
    }

    setIsModalOpen(false);
    setUrl("");
    setText("");
    setOpenInNewTab(true);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && url.trim()) handleAddLink();
    else if (e.key === "Escape") handleCloseModal();
  };

  const canRemoveLink = editor.isActive("link");

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Добавить ссылку (Ctrl+K)"
          onClick={handleOpenModal}
          className={`
            p-2 rounded duration-300 cursor-pointer
            ${
              editor.isActive("link")
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Удалить ссылку"
          onClick={handleRemoveLink}
          disabled={!canRemoveLink}
          className={`
            p-2 rounded duration-300
            ${
              canRemoveLink
                ? "text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }
          `}
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editor.isActive("link")
                  ? "Редактировать ссылку"
                  : "Добавить ссылку"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="link-text"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Текст ссылки
                  </label>
                  <input
                    id="link-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Текст ссылки (опционально)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="link-url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL адрес *
                  </label>
                  <input
                    ref={urlInputRef}
                    id="link-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 text-gray-500 mr-2" />
                    <label
                      htmlFor="open-in-new-tab"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Открывать в новой вкладке
                    </label>
                  </div>
                  <button
                    type="button"
                    aria-pressed={openInNewTab}
                    onClick={() => setOpenInNewTab(!openInNewTab)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full 
                      transition-colors focus:outline-none focus:ring-2 
                      focus:ring-[#9674F9] focus:ring-offset-2 cursor-pointer duration-300
                      ${openInNewTab ? "bg-[#9674F9]" : "bg-gray-300"}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white 
                        transition-transform duration-200
                        ${openInNewTab ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                  <input
                    type="checkbox"
                    id="open-in-new-tab"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  {openInNewTab
                    ? "Ссылка будет открываться в новой вкладке (рекомендуется для внешних ссылок)"
                    : "Ссылка будет открываться в текущей вкладке (рекомендуется для навигации по Вашему сайту)"}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                  rounded-md duration-300 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!url.trim()}
                  className={`
                    px-4 py-2 text-sm font-medium text-white rounded-md duration-300
                    ${
                      url.trim()
                        ? "bg-[#9674F9] hover:bg-[#8563e8] cursor-pointer"
                        : "bg-[#9674F9]/60 cursor-not-allowed"
                    }
                  `}
                >
                  {editor.isActive("link") ? "Обновить" : "Добавить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkMenu;
