import { buttonStyles } from "../styles";

export const profileStyles = {
  editButton: `${buttonStyles.active} [&&]:w-full [&&]:md:w-auto px-4 py-2 rounded items-center justify-center font-medium duration-300 cursor-pointer flex flex-row gap-x-3`,
  cancelButton:
    "px-4 py-2 md:flex-none flex-1 bg-[#f3f2f1] rounded hover:shadow-button-secondary active:shadow-(--shadow-button-active) text-[#606060] duration-300 cursor-pointer",
  saveButton:
    "px-4 py-2 md:flex-none flex-1 bg-primary hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) rounded text-white duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
  sectionTitle: "text-lg font-semibold text-main-text",
  inputContainer: "relative",
};