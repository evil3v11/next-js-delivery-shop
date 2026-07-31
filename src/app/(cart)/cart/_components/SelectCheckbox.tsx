import { memo } from "react";

import IconSelect from "./IconSelect";

interface SelectCheckboxProps {
  isSelected: boolean;
  onSelectionChange: (isSelected: boolean) => void;
}

const SelectCheckbox = memo(function SelectCheckbox({ isSelected, onSelectionChange }: SelectCheckboxProps) {
  return (
    <label className="flex items-center cursor-pointer z-50">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelectionChange(e.target.checked)}
        className="hidden"
      />
      <span
        className={`
          w-6 h-6 border-2 rounded flex items-center justify-center duration-300 absolute top-2 left-2
          ${isSelected ? "bg-primary border-[#f3f2f1]" : "bg-white border-[#f3f2f1]"}
        `}
      >
        {isSelected && <IconSelect />}
      </span>
    </label>
  );
});

export default SelectCheckbox;
