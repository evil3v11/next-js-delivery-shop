"use client";

import { regions } from "@/data/regions";
import { formStyles } from "../styles";

import Image from "next/image";

interface SelectRegionProps {
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectRegion = ({ value, onChangeAction }: SelectRegionProps) => {
  return (
    <div>
      <label htmlFor="region" className={formStyles.label}>
        Регион
      </label>
      <div className="relative">
        <select
          id="region"
          value={value}
          onChange={onChangeAction}
          className={`${formStyles.input} appearance-none pr-8 cursor-pointer`}
        >
          {regions.map(({ value, label }) => (
            <option key={value}>{label}</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="/icons-products/icon-arrow-right.svg"
            alt="Выберите регион"
            width={24}
            height={24}
            sizes="24px"
            className="rotate-90"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectRegion;
