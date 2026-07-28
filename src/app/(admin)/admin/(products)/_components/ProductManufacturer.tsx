'use client'

import { formStyles } from "@/app/(auth)/styles";

interface ProductManufacturerProps {
  manufacturer: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductManufacturer = ({
  manufacturer,
  onChangeAction,
}: ProductManufacturerProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Производитель <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="manufacturer"
        required
        value={manufacturer}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductManufacturer;
