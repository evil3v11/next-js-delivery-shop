"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Product } from "@/types/product";
import {
  AddProductApiResponse,
  AddProductFormData,
  ImageUploadResponse,
} from "@/types/addProductTypes";

import { initialProductData } from "@/constants/addProductFormData";

import Link from "next/link";
import ProductTitle from "../../_components/ProductTitle";
import ProductArticle from "../../_components/ProductArticle";
import ProductDescription from "../../_components/ProductDescription";
import ProductBasePrice from "../../_components/ProductBasePrice";
import ProductDiscount from "../../_components/ProductDiscount";
import ProductQuantity from "../../_components/ProductQuantity";
import ProductWeight from "../../_components/ProductWeight";
import ProductBrand from "../../_components/ProductBrand";
import ProductManufacturer from "../../_components/ProductManufacturer";
import ProductCategories from "../../_components/ProductCategories";
import ProductTags from "../../_components/ProductTags";
import CheckboxGroup from "../../_components/CheckboxGroup";
import ImageUploadSection from "../../_components/ImageUploadSection";
import MiniLoader from "@/components/MiniLoader";

const EditProductPage = () => {
  const { productId } = useParams();
  const [productData, setProductData] =
    useState<AddProductFormData>(initialProductData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasActionsTag = productData.tags?.includes("actions");

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      if (!productId) return;
      try {
        setIsProductLoading(true);
        const response = await fetch(`/api/products/${productId}`, {
          next: { revalidate: 3600 },
        });
        if (!response.ok) {
          setError("Ошибка при запросе информации о продукте");
          return;
        }

        const product: Product = await response.json();
        setProductData({
          title: product.title || "",
          description: product.description || "",
          basePrice: String(product.basePrice) || "0",
          discountPercent: String(product.discountPercent) || "0",
          weight: String(product.weight) || "0",
          quantity: String(product.quantity) || "0",
          article: String(product.article) || "",
          brand: product.brand || "",
          manufacturer: product.manufacturer || "",
          categories: product.categories || [],
          tags: product.tags || [],
          isHealthyFood: product.isHealthyFood || false,
          isNonGMO: product.isNonGMO || false,
        });
        setExistingImage(product.img);
      } catch (e) {
        alert(`Не удалось получить информацию о товаре: ${e}`);
      } finally {
        setIsProductLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCategoriesChange = (categories: string[]): void =>
    setProductData((prev) => ({ ...prev, categories }));
  const handleTagChange = (tags: string[]): void =>
    setProductData((prev) => ({ ...prev, tags }));
  const handleImageChange = (file: File | null): void => setImage(file);

  const uploadImage = async (image: File | null): Promise<boolean> => {
    if (!image || !productId) return false;
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("imageId", String(productId));

      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      });
      const data: ImageUploadResponse = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Ошибка при загрузке изображения");
      return data.success;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка при загрузке изображения");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    if (
      hasActionsTag &&
      (!productData.discountPercent || productData.discountPercent === "0")
    ) {
      alert('Для товара с тегом "Акции" обязательно укажите размер скидки');
      return;
    }

    try {
      setIsLoading(true);
      if (image) {
        const uploadResult = await uploadImage(image);
        if (!uploadResult) {
          alert("Ошибка загрузки изображения");
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/products/update-product", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...productData, id: Number(productId) }),
      });
      const result: AddProductApiResponse = await response.json();
      if (!response.ok)
        alert(result.error || "Ошибка добавления нового продукта");
      if (result.success) alert("Товар успешно обновлен");
    } catch (e) {
      alert(
        "Ошибка: " + (e instanceof Error ? e.message : "Неизвестная ошибка"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isProductLoading) return <MiniLoader />;

  if (error) {
    return (
      <div className="container flex flex-col items-center px-4 py-8 mx-auto">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <Link
          href="/administrator/products-list"
          className="bg-primary text-white py-2 px-4 rounded"
        >
          Вернуться к списку продуктов
        </Link>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center px-4 py-8 text-main-text mx-auto">
      <h1 className="text-3xl font-bold mb-8">Редактировать товар</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductTitle
            title={productData.title}
            onChangeAction={handleInputChange}
          />
          <ProductArticle
            article={String(productData.article)}
            onChangeAction={handleInputChange}
          />
        </div>
        <ProductDescription
          description={productData.description}
          onChangeAction={handleInputChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductBasePrice
            basePrice={String(productData.basePrice)}
            onChangeAction={handleInputChange}
          />
          <ProductDiscount
            discount={String(productData.discountPercent)}
            onChangeAction={handleInputChange}
            required={hasActionsTag}
          />
          <ProductQuantity
            quantity={String(productData.quantity)}
            onChangeAction={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductWeight
            weight={productData.weight}
            onChangeAction={handleInputChange}
          />
          <ProductBrand
            brand={productData.brand}
            onChangeAction={handleInputChange}
          />
          <ProductManufacturer
            manufacturer={productData.manufacturer}
            onChangeAction={handleInputChange}
          />
        </div>
        <ProductCategories
          selectedCategories={productData.categories}
          onCategoriesChange={handleCategoriesChange}
        />
        <ProductTags
          selectedTags={productData.tags}
          onTagsChange={handleTagChange}
          hasActionsTag={hasActionsTag}
        />
        <CheckboxGroup
          items={[
            {
              name: "isHealthyFood",
              label: "Здоровая еда",
              checked: productData.isHealthyFood,
            },
            {
              name: "isNonGMO",
              label: "Без ГМО",
              checked: productData.isNonGMO,
            },
          ]}
          onChange={handleInputChange}
        />
        <ImageUploadSection
          onImageChange={handleImageChange}
          isUploading={isUploading}
          isLoading={isLoading}
          existingImage={existingImage}
        />
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full bg-primary hover:shadow-button-default active:shadow-button-active text-white 
          py-3 px-4 mb-5 rounded disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Обновление..." : "Обновить товар"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
