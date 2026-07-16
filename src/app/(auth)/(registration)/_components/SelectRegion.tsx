"use client";

import { regions } from "@/data/regions";
import { formStyles } from "../../styles";

import Image from "next/image";

interface SelectRegionProps {
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const SelectRegion = ({
  value,
  onChangeAction,
  className,
  disabled,
}: SelectRegionProps) => {
  return (
    <div className={className}>
      <label htmlFor="region" className={formStyles.label}>
        Регион
      </label>
      <div className="relative">
        <select
          id="region"
          name="region"
          value={value}
          onChange={onChangeAction}
          disabled={disabled}
          className={`${formStyles.input} appearance-none pr-8 cursor-pointer ${className} 
          disabled:cursor-not-allowed disabled:bg-[#f3f2f1] disabled:text-gray-400`}
        >
          {regions.map(({ value, label }) => (
            <option key={value} value={label}>{label}</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {!disabled && (
            <Image
              src="/icons-products/icon-arrow-right.svg"
              alt="Выберите регион"
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

export default SelectRegion;
