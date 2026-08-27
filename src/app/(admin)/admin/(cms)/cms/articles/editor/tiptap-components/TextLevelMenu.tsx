import { useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { EditorProps } from "../../_types";

import { Type, ChevronDown, Check } from "lucide-react";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";

const TextLevelMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutsideModal<HTMLDivElement>(() =>
    setIsOpen(false),
  );

  const getCurrentLabel = () => {
    if (editor?.isActive("paragraph")) return "Текст";
    for (let i = 1; i <= 6; i++) {
      if (editor?.isActive("heading", { level: i as 1 | 2 | 3 | 4 | 5 | 6 }))
        return `H${i}`;
    }
    return "Текст";
  };

  if (!editor) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        title="Тип текста"
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md duration-300 cursor-pointer
          ${
            isOpen
              ? "bg-blue-100 text-[#9674F9] border-blue-300"
              : "text-gray-700 hover:bg-gray-100 border-gray-300"
          }
        `}
      >
        <span className="text-xs font-medium">{getCurrentLabel()}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg min-w-40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <div className="px-3 py-2 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                ТИП ТЕКСТА
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setParagraph().run();
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex justify-between items-center duration-300 cursor-pointer
                ${
                  editor.isActive("paragraph")
                    ? "bg-blue-50 text-[#9674F9] border-r-2 border-[#9674F9]"
                    : "text-gray-700"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <span>Текст</span>
              </div>
              {editor.isActive("paragraph") && <Check className="w-3 h-3" />}
            </button>
            <div className="border-t border-gray-100 my-1" />
            {[1, 2, 3, 4, 5, 6].map((level) => {
              const isActive = editor.isActive("heading", {
                level: level as 1 | 2 | 3 | 4 | 5 | 6,
              });

              return (
                <div key={level} className="px-1">
                  <HeadingButton
                    level={level as 1 | 2 | 3 | 4 | 5 | 6}
                    editor={editor}
                    onClick={() => setIsOpen(false)}
                    className={`
                      w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex justify-between items-center duration-300 cursor-pointer
                      ${
                        isActive
                          ? "bg-blue-50 text-[#9674F9] border-r-2 border-[#9674F9]"
                          : "text-gray-700"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">H{level}</span>
                      <span className="text-gray-500 text-xs">
                        Заголовок {level}
                      </span>
                    </div>
                    {isActive && <Check className="w-3 h-3" />}
                  </HeadingButton>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextLevelMenu;
