'use client'

import { formStyles } from "@/app/(auth)/styles";

interface ProductBasePriceProps {
  basePrice: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductBasePrice = ({
  basePrice,
  onChangeAction,
}: ProductBasePriceProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Базовая цена (руб.) <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="number"
        name="basePrice"
        step="0.01"
        required
        value={basePrice}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductBasePrice;
