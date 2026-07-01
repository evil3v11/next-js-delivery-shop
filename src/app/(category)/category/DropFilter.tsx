"use client";

import Image from "next/image";
import { useState } from "react";
import FilterButtons from "./FilterButtons";
import FilterControls from "./FilterControls";
import PriceFilter from "./PriceFilter";

const DropFilter = ({
  basePath,
  category,
}: {
  basePath: string;
  category: string;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className="ml-3 xl:hidden h-8 p-2 rounded w-32 text-xs flex justify-center items-center 
          duration-300 gap-x-2 bg-primary hover:bg-primary/80 text-white shadow-button-default 
          active:shadow-button-active cursor-pointer"
        onClick={() => setIsFilterOpen(true)}
      >
        Фильтр
      </button>

      <div
        className={`xl:hidden flex flex-col gapy-10 fixed top-0 left-0 h-screen w-full max-w-90
          bg-white z-50 p-4 overflow-y-auto shadow-article text-[#414141] 
          transform origin-left transition-all duration-300 ease-in-out 
          ${isFilterOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
      >
        <div
          className="flex justify-between items-center mb-4 bg-[#f3f2f1] h-11 rounded 
      text-base font-bold p-2.5"
        >
          <h3 className="flex justify-start items-center">Фильтр</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-2xl cursor-pointer"
          >
            <Image
              src={"/icons-products/icon-closer.svg"}
              alt="Закрыть фильтры"
              width={24}
              height={24}
              sizes="24px"
            />
          </button>
        </div>
        <FilterButtons basePath={basePath} />
        <FilterControls basePath={basePath} />
        <PriceFilter
          basePath={basePath}
          category={category}
          setIsFilterOpenAction={setIsFilterOpen}
        />
      </div>
    </>
  );
};

export default DropFilter;
