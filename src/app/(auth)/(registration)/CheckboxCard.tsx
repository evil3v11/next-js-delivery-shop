"use client";

import Image from "next/image";

interface CheckboxCardProps {
  checked: boolean;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxCard = ({ checked, onChangeAction }: CheckboxCardProps) => {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="hasNoCard"
        className="inline-flex items-center cursor-pointer"
      >
        <input
          id="hasNoCard"
          type="checkbox"
          checked={checked}
          onChange={onChangeAction}
          className="absolute opacity-0 h-0 w-0"
        />
        <span
          className={`relative w-5 h-5 border rounded flex items-center justify-center duration-300
            ${checked ? "bg-primary border-primary" : "bg-white border-[#bfbfbf]"}`}
        >
          {checked && (
            <Image
              src="/icons-auth/icon-has-card.svg"
              alt={checked ? "Есть карта лояльности" : "Нет карты лояльности"}
              height={12}
              width={12}
              sizes="12px"
              className="text-white"
            />
          )}
        </span>
        <span className="ml-2 text-[#8f8f8f]">У меня нет карты лояльности</span>
      </label>
    </div>
  );
};

export default CheckboxCard;
