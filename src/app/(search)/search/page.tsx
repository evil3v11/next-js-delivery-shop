"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProductCardProps } from "@/types/product";
import Loader from "@/components/Loader";
import ProductsSection from "@/app/(products)/ProductsSection";

const SearchResult = () => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        console.error("Не удалось получить результаты поиска:\n", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchSearchResult();
  }, [query]);

  if (isLoading) return <Loader />;

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
          <ProductsSection title="" products={products} />
        )}
      </div>
  );
};

export default SearchResult;
