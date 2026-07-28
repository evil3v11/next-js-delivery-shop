'use client'

import CustomCheckbox from "./CustomCheckbox";

interface CheckboxItem {
  name: string;
  label: string;
  checked: boolean;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CheckboxGroup = ({
  items,
  onChange,
  className = "",
}: CheckboxGroupProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {items.map(({ name, label, checked }) => (
        <CustomCheckbox
          key={name}
          name={name}
          label={label}
          checked={checked}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default CheckboxGroup;
