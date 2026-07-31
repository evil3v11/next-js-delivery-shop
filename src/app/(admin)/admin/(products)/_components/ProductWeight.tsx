'use client'

import { formStyles } from "@/app/styles";

interface ProductWeightProps {
  weight: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductWeight = ({ weight, onChangeAction }: ProductWeightProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Вес (кг) <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="number"
        name="weight"
        step="0.01"
        value={weight}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductWeight;
