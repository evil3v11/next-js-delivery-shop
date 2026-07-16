"use client";

import { cities } from "@/data/cities";
import { formStyles } from "../../styles";

import Image from "next/image";

interface SelectCityProps {
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const SelectCity = ({
  value,
  onChangeAction,
  className,
  disabled,
}: SelectCityProps) => {
  return (
    <div className={className}>
      <label htmlFor="location" className={formStyles.label}>
        Город
      </label>
      <div className="relative">
        <select
          id="location"
          name='location'
          value={value}
          onChange={onChangeAction}
          disabled={disabled}
          className={`${formStyles.input} appearance-none pr-8 cursor-pointer ${className} 
          disabled:cursor-not-allowed disabled:bg-[#f3f2f1] disabled:text-gray-400`}
        >
          {cities.map(({ value, label }) => (
            <option key={value} value={label}>{label}</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {!disabled && (
            <Image
              src="/icons-products/icon-arrow-right.svg"
              alt="Выберите город"
              width={24}
              height={24}
              sizes="24px"
              className="rotate-90"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCity;
