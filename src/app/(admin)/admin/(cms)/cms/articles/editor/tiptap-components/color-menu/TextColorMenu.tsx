"use client";

import { Activity } from "react";
import { useTextEditorColorMenu } from "../../_hooks/useTextEditorColorMenu";

import { EditorProps } from "../../../_types";

import { TEXT_COLORS } from "../../_utils/colors";

import ColorMenuModal from "./ColorMenuModal";
import ToggleMenuButton from "./ToggleMenuButton";

const TextColorMenu = ({ editor }: EditorProps) => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    customColor,
    setCustomColor,
    getCurrentColor,
    handleApplyColor,
    resetColor,
    applyCustomColor,
    dropdownRef,
    handleCustomColorChange,
  } = useTextEditorColorMenu(editor, "text");

  const currentColor = getCurrentColor();
  const isActive = currentColor != "#000000";

  return (
    <div className="relative inline-block">
      <ToggleMenuButton
        type="text"
        title="Цвет текста"
        currentColor={currentColor}
        isMenuOpen={isMenuOpen}
        isActive={isActive}
        handleMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      <Activity mode={isMenuOpen ? "visible" : "hidden"}>
        <ColorMenuModal
          type="text"
          dropdownRef={dropdownRef}
          colors={TEXT_COLORS}
          currentColor={currentColor}
          customColor={customColor}
          handleApplyColor={handleApplyColor}
          setCustomColor={setCustomColor}
          handleCustomColorChange={handleCustomColorChange}
          applyCustomColor={applyCustomColor}
          resetColor={resetColor}
        />
      </Activity>
    </div>
  );
};

export default TextColorMenu;
