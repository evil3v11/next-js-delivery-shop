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

import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";
import PriceFilterHeader from "./PriceFilterHeader";
import PriceInputs from "./PriceInputs";
import PriceRangeSlider from "./PriceRangeSlider";
import InStockToggle from "./InStockToggle";

const PriceFilter = ({
  basePath,
  category,
  setIsFilterOpenAction,
}: PriceFilterProps) => {
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

      const roundedRange = {
        min: Math.floor(Number(receivedRange.min)),
        max: Math.ceil(Number(receivedRange.max)),
      };

      setPriceRange(roundedRange);
      setInputValues({
        from: urlPriceFrom || String(roundedRange.min),
        to: urlPriceTo || String(roundedRange.max),
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

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    applyPriceFilter();

    if (setIsFilterOpenAction) setIsFilterOpenAction(false);
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

  const handleSliderChange = useCallback((values: [number, number]) => {
    setInputValues({
      from: String(values[0]),
      to: String(values[1]),
    });
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
      <PriceFilterHeader onResetAction={resetPriceFilter} />
      <PriceInputs
        inputValues={inputValues}
        priceRange={priceRange}
        onChangeFromAction={(value: string) =>
          setInputValues((prev) => ({ ...prev, from: value }))
        }
        onChangeToAction={(value: string) =>
          setInputValues((prev) => ({ ...prev, to: value }))
        }
      />
      <PriceRangeSlider
        priceRange={priceRange}
        values={sliderValues}
        onChangeSliderAction={handleSliderChange}
      />
      <InStockToggle
        inStock={inStock}
        handleInStockChange={handleInStockChange}
      />
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
