"use client";

import { formStyles } from "../styles";

interface GenderSelectProps {
  value: string;
  onChangeAction: (gender: string) => void;
}

const GenderSelect = ({ value, onChangeAction }: GenderSelectProps) => {
  const gender = [
    { id: "male", label: "Мужской" },
    { id: "female", label: "Женский" },
  ];

  return (
    <div className="text-xs w-full">
      <p className={formStyles.label}>Пол</p>
      <div className="flex gap-1 bg-[#f3f2f1] h-10 rounded p-1">
        {gender.map(({ id, label }) => (
          <label
            key={id}
            className={`flex flex-1 items-center justify-center rounded duration-300 
              cursor-pointer ${value === id ? "bg-primary text-white" : ""}`}
          >
            <input
              type="radio"
              value={id}
              checked={value === id}
              onChange={() => onChangeAction(id)}
              className="hidden"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenderSelect;
