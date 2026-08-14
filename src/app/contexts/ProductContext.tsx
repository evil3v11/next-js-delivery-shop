"use client";

import { createContext, useContext, useState } from "react";

type ProductContextType = {
  title: string | null;
  setTitle: (title: string) => void;
};

const ProductContext = createContext<ProductContextType>({
  title: null,
  setTitle: () => {},
});

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [title, setTitle] = useState<string | null>("");
  return (
    <ProductContext.Provider value={{ title, setTitle }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
