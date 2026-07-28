'use client'

import { formStyles } from "@/app/(auth)/styles";

interface ProductQuantityProps {
  quantity: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductQuantity = ({
  quantity,
  onChangeAction,
}: ProductQuantityProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Количество <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="number"
        name="quantity"
        required
        value={quantity}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductQuantity;
