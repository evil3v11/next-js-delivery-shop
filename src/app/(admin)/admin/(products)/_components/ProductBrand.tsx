'use client'

import { formStyles } from "@/app/(auth)/styles";

interface ProductBrandProps {
  brand: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductBrand = ({ brand, onChangeAction }: ProductBrandProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Бренд <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="brand"
        required
        value={brand}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductBrand;
