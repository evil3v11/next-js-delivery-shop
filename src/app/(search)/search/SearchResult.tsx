"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProductCardProps } from "@/types/product";

import ProductsSection from "@/app/(products)/ProductsSection";
import ErrorComponent from "@/components/ErrorComponent";
import Loader from "@/components/Loader";

const SearchResult = () => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchSearchResult = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/search-full?query=${encodeURIComponent(query)}`,
        );

        const data = await response.json();
        setProducts(data);
      } catch (e) {
        setError({
          error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
          userMessage: "Не удалось загрузить результат поиска",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchSearchResult();
  }, [query]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] text-[#414141] my-20">
      <h1 className="text-2xl xl:text-4xl text-left font-bold mb-6">
        Результат поиска
      </h1>
      <p className="text-sm md:text-base xl:text-2xl">
        по запросу <span className="text-[#ff6633]">{query}</span>
      </p>
      {!products.length ? (
        <p className="text-2xl mt-5">По вашему запросу ничего не найдено</p>
      ) : (
        <ProductsSection title="" products={products} applyIndexStyle={false} />
      )}
    </div>
  );
};

export default SearchResult;
