"use client";

import { useCallback, useState } from "react";

import { initialProductData } from "@/constants/addProductFormData";

import {
  AddProductApiResponse,
  AddProductFormData,
  ImageUploadResponse,
} from "@/types/addProductTypes";

import ProductTitle from "../_components/ProductTitle";
import ProductArticle from "../_components/ProductArticle";
import ProductDescription from "../_components/ProductDescription";
import ProductBasePrice from "../_components/ProductBasePrice";
import ProductDiscount from "../_components/ProductDiscount";
import ProductQuantity from "../_components/ProductQuantity";
import ProductWeight from "../_components/ProductWeight";
import ProductBrand from "../_components/ProductBrand";
import ProductManufacturer from "../_components/ProductManufacturer";
import ProductCategories from "../_components/ProductCategories";
import ProductTags from "../_components/ProductTags";
import CheckboxGroup from "../_components/CheckboxGroup";
import ImageUploadSection from "../_components/ImageUploadSection";
import CreateSuccessMessage from "../_components/CreateSuccessMessage";

const AddProductPage = () => {
  const [formData, setFormData] =
    useState<AddProductFormData>(initialProductData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);

  const hasActionsTag = formData.tags.includes("actions");

  const generateProductId = useCallback(
    () => Math.floor(Math.random() * 1000000000000000),
    [],
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCategoriesChange = (categories: string[]): void =>
    setFormData((prev) => ({ ...prev, categories }));
  const handleTagChange = (tags: string[]): void =>
    setFormData((prev) => ({ ...prev, tags }));

  const handleImageChange = (file: File | null): void => setImage(file);

  const uploadImage = async (
    image: File | null,
    productId: number | null,
  ): Promise<{ id: number; img: string } | null> => {
    if (!image || !productId) return null;
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
      if (data.success && data.product)
        return { id: data.product.id, img: data.product.img };
      return null;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка при загрузке изображения");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    if (
      hasActionsTag &&
      (!formData.discountPercent || formData.discountPercent === "0")
    ) {
      alert('Для товара с тегом "Акции" обязательно укажите размер скидки');
      return;
    }

    try {
      setIsLoading(true);

      const productId = generateProductId();
      let imagePath: string | null = null;

      if (image) {
        const uploadResult = await uploadImage(image, productId);
        if (uploadResult) {
          imagePath = uploadResult.img;
        } else {
          alert("Ошибка загрузки изображения");
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/products/add-product", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: productId,
          img: imagePath,
        }),
      });
      const result: AddProductApiResponse = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Ошибк а добавления нового продукта");
      if (response.ok && result.success) setCreatedProductId(productId);
    } catch (e) {
      alert(
        "Ошибка: " + (e instanceof Error ? e.message : "Неизвестная ошибка"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = (): void => {
    setFormData(initialProductData);
    setImage(null);
    setCreatedProductId(null);
  };

  return (
    <div className="container flex flex-col items-center px-4 py-8 text-main-text mx-auto">
      <h1 className="text-3xl font-bold mb-8">Добавить товар</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductTitle
            title={formData.title}
            onChangeAction={handleInputChange}
          />
          <ProductArticle
            article={formData.article}
            onChangeAction={handleInputChange}
          />
        </div>
        <ProductDescription
          description={formData.description}
          onChangeAction={handleInputChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductBasePrice
            basePrice={formData.basePrice}
            onChangeAction={handleInputChange}
          />
          <ProductDiscount
            discount={formData.discountPercent}
            onChangeAction={handleInputChange}
            required={hasActionsTag}
          />
          <ProductQuantity
            quantity={formData.quantity}
            onChangeAction={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductWeight
            weight={formData.weight}
            onChangeAction={handleInputChange}
          />
          <ProductBrand
            brand={formData.brand}
            onChangeAction={handleInputChange}
          />
          <ProductManufacturer
            manufacturer={formData.manufacturer}
            onChangeAction={handleInputChange}
          />
        </div>
        <ProductCategories
          selectedCategories={formData.categories}
          onCategoriesChange={handleCategoriesChange}
        />
        <ProductTags
          selectedTags={formData.tags}
          onTagsChange={handleTagChange}
          hasActionsTag={hasActionsTag}
        />
        <CheckboxGroup
          items={[
            {
              name: "isHealthyFood",
              label: "Здоровая еда",
              checked: formData.isHealthyFood,
            },
            { name: "isNonGMO", label: "Без ГМО", checked: formData.isNonGMO },
          ]}
          onChange={handleInputChange}
        />
        <ImageUploadSection
          onImageChange={handleImageChange}
          isUploading={isUploading}
          isLoading={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full bg-primary hover:shadow-button-default active:shadow-button-active text-white 
          py-3 px-4 mb-5 rounded disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Добавление" : "Добавить товар"}
        </button>
      </form>
      {createdProductId && (
        <CreateSuccessMessage
          categories={formData.categories}
          createdProductId={createdProductId}
          onClearForm={handleClearForm}
        />
      )}
    </div>
  );
};

export default AddProductPage;
