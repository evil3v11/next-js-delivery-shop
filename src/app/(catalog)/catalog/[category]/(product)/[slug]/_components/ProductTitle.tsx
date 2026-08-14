"use client";

import { useEffect } from "react";
import { useProduct } from "@/app/contexts/ProductContext";

const ProductTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const { setTitle } = useProduct();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return <h1 className="text-xl md:text-2xl font-bold mb-4">{description}</h1>;
};

export default ProductTitle;
