"use client";

import { formStyles } from "../styles";

interface NameInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput = ({ id, label, value, onChange }: NameInputProps) => {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={formStyles.input}
      />
    </div>
  );
};

export default NameInput;
