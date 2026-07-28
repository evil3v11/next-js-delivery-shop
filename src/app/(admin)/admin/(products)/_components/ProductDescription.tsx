'use client'

import { formStyles } from "@/app/(auth)/styles";

interface ProductDescriptionProps {
  description: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductDescription = ({
  description,
  onChangeAction,
}: ProductDescriptionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Описание <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="description"
        required
        value={description}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductDescription;
