"use client";

import { useState } from "react";
import { formStyles } from "../styles";
import Tooltip from "./Tooltip";
import { validateBirthdayDate } from "@/utils/validation/validateBirthdayDate";
import Image from "next/image";

interface DateInputProps {
  value: string;
  onChangeAction: (value: string) => void;
}

const DateInput = ({ value, onChangeAction }: DateInputProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (input: string): string => {
    const cleanedDate = input.replace(/\D/g, "");
    let formattedDate = "";

    if (cleanedDate.length > 0) formattedDate = cleanedDate.slice(0, 2);
    if (cleanedDate.length > 2) formattedDate += "." + cleanedDate.slice(2, 4);
    if (cleanedDate.length > 4) formattedDate += "." + cleanedDate.slice(4, 8);

    return formattedDate;
  };

  const handleDateChange = (formattedDate: string): void => {
    const validationInfo = validateBirthdayDate(formattedDate);
    if (validationInfo.error) setError(validationInfo.error);
    setShowTooltip(Boolean(validationInfo.error));
    onChangeAction(formattedDate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formattedDate = formatDate(e.target.value);
    handleDateChange(formattedDate);
  };

  const handleCalendarClick = () => {
    const tempInput = document.createElement("input");
    tempInput.type = "date";
    tempInput.max = new Date().toISOString().split("T")[0];

    tempInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        const [year, month, day] = target.value.split("-");
        const formattedDate = `${day}.${month}.${year}`;
        handleDateChange(formattedDate);
      }

      document.body.removeChild(tempInput);
    };

    document.body.appendChild(tempInput);
    tempInput.showPicker();
  };

  return (
    <div>
      <label htmlFor="birthdatyDate" className={formStyles.label}>
        Дата рождения
      </label>
      <div className="relative">
        <input
          type="text"
          id="birthdatyDate"
          placeholder="дд.мм.гггг"
          value={value}
          onChange={handleInputChange}
          className={`${formStyles.input} pr-8`}
          maxLength={10}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          aria-label="Установить дату рождения"
          onClick={handleCalendarClick}
        >
          <Image
            src="/icons-auth/icon-date.svg"
            alt="Календарь"
            width={24}
            height={24}
            sizes="24px"
          />
        </button>
      </div>
      {showTooltip && error && <Tooltip text={error} />}
    </div>
  );
};

export default DateInput;
