'use client'

import { formStyles } from "@/app/(auth)/styles";

interface ProductTitleProps {
  title: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductTitle = ({ title, onChangeAction }: ProductTitleProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Название товара <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="title"
        required
        value={title}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default ProductTitle;
