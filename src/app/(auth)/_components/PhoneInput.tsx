"use client";

import { formStyles } from "../../styles";
import { InputMask } from "@react-input/mask";

interface PhoneInputProps {
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput = ({ value, onChangeAction }: PhoneInputProps) => {
  return (
    <div className="w-full">
      <label htmlFor="phoneNumber" className={formStyles.label}>
        Телефон
      </label>
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        id="phoneNumber"
        type="text"
        placeholder="+7 (___) ___-__-__"
        value={value}
        onChange={onChangeAction}
        className={`${formStyles.input} w-full`}
        showMask={true}
        onFocus={(e) =>
          e.target.value === "+7" ? e.target.setSelectionRange(2, 2) : ""
        }
      />
    </div>
  );
};

export default PhoneInput;
