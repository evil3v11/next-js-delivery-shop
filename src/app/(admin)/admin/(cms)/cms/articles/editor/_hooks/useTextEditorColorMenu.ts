import { useCallback, useEffect, useState } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { BG_COLORS, TEXT_COLORS } from "../../editor/_utils/colors";

import type { Editor } from "@tiptap/react";

export const useTextEditorColorMenu = (
  editor: Editor | null,
  type: "text" | "bg",
) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customColor, setCustomColor] = useState(
    type === "bg" ? "#FFFFFF" : "#000000",
  );

  const dropdownRef = useClickOutsideModal<HTMLDivElement>(() =>
    setIsMenuOpen(false),
  );

  const getCurrentColor = useCallback((): string => {
    if (!editor) return type === "bg" ? "transparent" : "#000000";

    const attributes = editor.getAttributes("textStyle");

    if (type === "bg") {
      return attributes.backgroundColor || "transparent";
    } else {
      return attributes.color || "#000000";
    }
  }, [editor, type]);

  useEffect(() => {
    if (editor) {
      const currentColor = getCurrentColor();

      if (
        type === "bg" &&
        currentColor !== "transparent" &&
        !BG_COLORS.includes(currentColor)
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCustomColor(currentColor);
      }

      if (
        type === "text" &&
        currentColor !== "#000000" &&
        !TEXT_COLORS.includes(currentColor)
      ) {
        setCustomColor(currentColor);
      }
    }
  }, [editor, getCurrentColor, type]);

  const applyColor = (color: string): void => {
    if (!editor) return;

    const currentColor = getCurrentColor();

    if (type === "bg") {
      if (color === "transparent")
        editor.chain().focus().unsetBackgroundColor().run();
      else editor.chain().focus().setBackgroundColor(color).run();

      if (!BG_COLORS.includes(currentColor)) setCustomColor(color);
    } else {
      if (color === "#000000") editor.chain().focus().unsetColor().run();
      else editor.chain().focus().setColor(color).run();

      if (!TEXT_COLORS.includes(currentColor)) setCustomColor(color);
    }
  };

  const handleApplyColor = (color: string): void => {
    applyColor(color);
    setIsMenuOpen(false);
  };

  const resetColor = (): void => {
    if (!editor) return;

    if (type === "bg") editor.chain().focus().unsetBackgroundColor().run();
    else editor.chain().focus().unsetColor().run();

    setIsMenuOpen(false);
  };

  const handleCustomColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => setCustomColor(e.target.value);

  const applyCustomColor = (): void => {
    if (!editor) return;

    if (type === "bg") {
      if (customColor === "transparent")
        editor.chain().focus().unsetBackgroundColor().run();
      else editor.chain().focus().setBackgroundColor(customColor).run();
    } else {
      if (customColor === "#000000") editor.chain().focus().unsetColor().run();
      else editor.chain().focus().setColor(customColor).run();
    }

    setIsMenuOpen(false);
  };

  return {
    isMenuOpen,
    customColor,
    setIsMenuOpen,
    setCustomColor,
    dropdownRef,
    getCurrentColor,
    applyColor,
    handleApplyColor,
    resetColor,
    handleCustomColorChange,
    applyCustomColor,
  };
};
