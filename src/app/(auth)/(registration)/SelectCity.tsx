"use client";

import { cities } from "@/data/cities";
import { formStyles } from "../styles";

import Image from "next/image";

interface SelectCityProps {
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCity = ({ value, onChangeAction }: SelectCityProps) => {
  return (
    <div>
      <label htmlFor="location" className={formStyles.label}>
        Регион
      </label>
      <div className="relative">
        <select
          id="location"
          value={value}
          onChange={onChangeAction}
          className={`${formStyles.input} appearance-none pr-8 cursor-pointer`}
        >
          {cities.map(({ value, label }) => (
            <option key={value}>{label}</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="/icons-products/icon-arrow-right.svg"
            alt="Выберите город"
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

export default SelectCity;
