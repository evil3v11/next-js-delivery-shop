"use client";

import { Activity } from "react";
import { useTextEditorColorMenu } from "../../_hooks/useTextEditorColorMenu";

import { EditorProps } from "../../../_types";

import { BG_COLORS } from "../../_utils/colors";

import ColorMenuModal from "./ColorMenuModal";
import ToggleMenuButton from "./ToggleMenuButton";

const BackgroundColorMenu = ({ editor }: EditorProps) => {
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
  } = useTextEditorColorMenu(editor, "bg");

  const currentColor = getCurrentColor();
  const isActive = currentColor != "#000000";

  return (
    <div className="relative inline-block">
      <ToggleMenuButton
        type="bg"
        title="Цвет фона"
        currentColor={currentColor}
        isMenuOpen={isMenuOpen}
        isActive={isActive}
        handleMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      <Activity mode={isMenuOpen ? "visible" : "hidden"}>
        <ColorMenuModal
          type="bg"
          dropdownRef={dropdownRef}
          colors={BG_COLORS}
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

export default BackgroundColorMenu;
