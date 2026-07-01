"use client";

import {
  SubmitEvent,
  ChangeEvent,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CONFIG } from "../../../../config/config";
import { PriceFilterProps, PriceRange } from "@/types/priceTypes";

import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";

import iconLine from "../../../../public/icons-products/icon-line.svg";

const PriceFilter = ({ basePath, category }: PriceFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlPriceFrom = searchParams.get("priceFrom") || "";
  const urlPriceTo = searchParams.get("priceTo") || "";
  const urlInStock = searchParams.get("inStock") === "true";

  const [inputValues, setInputValues] = useState({
    from: urlPriceFrom,
    to: urlPriceTo,
  });

  const [priceRange, setPriceRange] = useState<PriceRange>(
    CONFIG.FALLBACK_PRICE_RANGE,
  );

  const [inStock, setInStock] = useState<boolean>(urlInStock);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const fetchPriceData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentCategory = category || searchParams.get("category");
      if (!currentCategory) return;

      const params = new URLSearchParams();
      params.set("category", currentCategory);
      params.set("getPriceRangeOnly", "true");

      const response = await fetch(`/api/category?${String(params)}`);
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      const data = await response.json();
      const receivedRange = data.priceRange || CONFIG.FALLBACK_PRICE_RANGE;

      setPriceRange({
        min: Math.floor(Number(receivedRange.min)),
        max: Math.ceil(Number(receivedRange.max)),
      });

      setInputValues({
        from: urlPriceFrom || String(receivedRange.min),
        to: urlPriceTo || String(receivedRange.max),
      });
    } catch (e) {
      setError({
        error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить фильтр категории",
      });
      setPriceRange(CONFIG.FALLBACK_PRICE_RANGE);
      setInputValues({
        from: String(CONFIG.FALLBACK_PRICE_RANGE.min),
        to: String(CONFIG.FALLBACK_PRICE_RANGE.max),
      });
    } finally {
      setIsLoading(false);
    }
  }, [category, searchParams, urlPriceFrom, urlPriceTo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPriceData();
  }, [fetchPriceData]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    applyPriceFilter();
  };

  const applyPriceFilter = useCallback(() => {
    const params = new URLSearchParams(String(searchParams));

    let fromValue =
      Math.max(priceRange.min, Number(inputValues.from)) || priceRange.min;
    let toValue =
      Math.min(priceRange.max, Number(inputValues.to)) || priceRange.max;

    if (fromValue > toValue) [fromValue, toValue] = [toValue, fromValue];

    params.set("priceFrom", String(fromValue));
    params.set("priceTo", String(toValue));
    params.set("inStock", String(inStock));
    params.set("page", "1");

    router.push(`${basePath}?${String(params)}`);
  }, [
    basePath,
    inputValues.from,
    inputValues.to,
    priceRange.max,
    priceRange.min,
    router,
    searchParams,
    inStock,
  ]);

  const handleInStockChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInStock(e.target.checked);
    },
    [],
  );

  const sliderValues = [
    Number(inputValues.from) || priceRange.min,
    Number(inputValues.to) || priceRange.max,
  ];

  const handleSliderChange = useCallback((values: number | number[]) => {
    if (Array.isArray(values)) {
      setInputValues({
        from: String(values[0]),
        to: String(values[1]),
      });
    }
  }, []);

  const resetPriceFilter = useCallback(() => {
    setInputValues({
      from: String(priceRange.min),
      to: String(priceRange.max),
    });

    const params = new URLSearchParams(String(searchParams));
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("page");

    router.push(`${basePath}?${String(params)}`);
  }, [priceRange.max, priceRange.min, router, basePath, searchParams]);

  if (isLoading) return <MiniLoader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-10 text-[#414141] mt-10 xl:mt-0"
    >
      <div className="flex justify-between items-center">
        <p className="text-black text-base">Цена</p>
        <button
          type="button"
          onClick={resetPriceFilter}
          className="text-xs rounded bg-[#f3f2f1] h-8 p-2 cursor-pointer"
        >
          Очистить
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <input
          type="number"
          name="from"
          value={inputValues.from}
          onChange={handleInputChange}
          placeholder={`${priceRange.min}`}
          min={priceRange.min}
          max={priceRange.max}
          className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
        />
        <Image src={iconLine} alt="до" width={24} height={24} sizes="24px" />
        <input
          type="number"
          name="to"
          value={inputValues.to}
          onChange={handleInputChange}
          placeholder={`${priceRange.max}`}
          min={priceRange.min}
          max={priceRange.max}
          className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
        />
      </div>
      <div className="w-[320px] xl:w-[272px] px-2 mx-auto">
        <Slider
          range
          min={priceRange.min}
          max={priceRange.max}
          value={sliderValues}
          onChange={handleSliderChange}
          styles={{
            track: {
              backgroundColor: "#70c05b",
              height: 4,
            },
            handle: {
              width: 20,
              height: 20,
              backgroundColor: "#70c05b",
              border: "1px solid #fff",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              marginTop: -8,
              cursor: "pointer",
              opacity: 1,
            },
            rail: {
              backgroundColor: "#f0f0f0",
              height: 4,
            },
          }}
        />
      </div>
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
      <button
        type="submit"
        className="bg-[#ff6633] text-white hover:shadow-article active:shadow-button-active 
          h-10 rounded justify-center items-center duration-300 cursor-pointer"
      >
        Применить
      </button>
    </form>
  );
};

export default PriceFilter;
