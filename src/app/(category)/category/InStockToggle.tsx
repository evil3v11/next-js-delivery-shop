"use client";

import { ChangeEvent } from "react";

interface InStockToggleProps {
  inStock: boolean;
  handleInStockChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InStockToggle = ({
  inStock,
  handleInStockChange,
}: InStockToggleProps) => {
  return (
    <div className="flex gap-x-2 justify-start items-center">
      <div
        className={`w-12 h-6 rounded-full transition-colors duration-300 px-0.5
            ${!inStock ? "bg-gray-200" : "bg-primary"}`}
      >
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={handleInStockChange}
            className="sr-only"
          />
          <div
            className={`absolute top-0.5 left-0 w-5 h-5 border-[0.5px] border-[rgba(0,0,0,0.04)]
            rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.15)]
            bg-white transition-transform duration-300
            ${inStock ? "transform translate-x-6" : "transform translate-x-0"}`}
          />
        </label>
      </div>
      <span className="text-sm text-[#414141]">В наличии</span>
    </div>
  );
};

export default InStockToggle;
