import { Metadata } from "next";

import { baseUrl } from "@/utils/baseUrl";
import { getProduct } from "../getProduct";

import type { Product } from "@/types/product";

import ErrorComponent from "@/components/ErrorComponent";
import ProductPageContent from "./_components/ProductPageContent";

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

const extractIdFromSlug = (slug: string): string => {
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : slug;
};

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { category, slug } = await params;
  const productId = extractIdFromSlug(slug);
  const product: Product = await getProduct(productId);

  const canonicalUrl = `${baseUrl}/catalog/${category}/${slug}`;

  return {
    title: product.title,
    description: `Заказывайте ${product.title} по лучшей цене. Быстрая доставка, гарантия качества.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.title,
      description:
        product.description || `Заказывайте ${product.title} по лучшей цене`,
      url: canonicalUrl,
      images: product.img
        ? {
            url: `${baseUrl}${product.img}`,
            alt: product.title,
            width: 512,
            height: 512,
          }
        : undefined,
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  let product: Product;

  try {
    const { slug } = await params;
    const productId = extractIdFromSlug(slug);
    product = await getProduct(productId);
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
