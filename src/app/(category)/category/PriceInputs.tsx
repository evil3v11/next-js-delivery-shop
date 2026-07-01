"use client";

import { PriceInputsProps } from "@/types/priceInputsProps";

import Image from "next/image";

const PriceInputs = ({
  inputValues,
  priceRange,
  onChangeFromAction,
  onChangeToAction,
}: PriceInputsProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <input
        type="number"
        name="from"
        value={inputValues.from}
        onChange={(e) => onChangeFromAction(e.target.value)}
        placeholder={`${priceRange.min}`}
        min={priceRange.min}
        max={priceRange.max}
        className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
      />
      <Image
        src="/icons-products/icon-line.svg"
        alt="до"
        width={24}
        height={24}
        sizes="24px"
      />
      <input
        type="number"
        name="to"
        value={inputValues.to}
        onChange={(e) => onChangeToAction(e.target.value)}
        placeholder={`${priceRange.max}`}
        min={priceRange.min}
        max={priceRange.max}
        className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
      />
    </div>
  );
};

export default PriceInputs;
