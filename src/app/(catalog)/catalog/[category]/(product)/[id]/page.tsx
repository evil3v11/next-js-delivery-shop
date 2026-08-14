import { Metadata } from "next";

import { Product } from "@/types/product";

import { getProduct } from "../getProduct";

import ErrorComponent from "@/components/ErrorComponent";
import ProductPageContent from "./_components/ProductPageContent";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const generateMetadata = async ({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> => {
  try {
    const { id } = await params;
    const product = await getProduct(id);

    return {
      title: product.title,
      description: `Заказывайте ${product.title} по лучшей цене. Быстрая доставка, гарантия хорошего качества`,
      openGraph: {
        title: product.title,
        description:
          product.description || `Заказывайте ${product.title} по лучшей цене`,
        images: product.img ? [product.img[0]] : [],
      },
    };
  } catch {
    const searchParamsObject = await searchParams;
    const productTitle = decodeURIComponent(String(searchParamsObject.desc));

    return {
      title: `${productTitle}`,
      description: `Заказывайте ${productTitle} по лучшей цене. Быстрая доставка, гарантия хорошего качества`,
    };
  }
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  let product: Product;

  try {
    product = await getProduct(id);
  } catch (e) {
    return (
      <ErrorComponent
        error={e instanceof Error ? e : new Error(String(e))}
        userMessage="Не удалось загрузить данные о продукте"
      />
    );
  }

  if (!product)
    return (
      <ErrorComponent
        error={new Error("Продукт не найден")}
        userMessage="Продукт не найден"
      />
    );

  return <ProductPageContent product={product} />;
};

export default ProductPage;
