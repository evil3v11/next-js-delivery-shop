"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateRegisterFormData } from "@/utils/validation/form";

import Image from "next/image";
import PhoneInput from "../PhoneInput";
import NameInput from "../NameInput";
import PasswordInput from "../PasswordInput";
import DateInput from "../DateInput";
import SelectRegion from "../SelectRegion";
import SelectCity from "../SelectCity";
import GenderSelect from "../GenderSelect";
import CardInput from "../CardInput";
import CheckboxCard from "../CheckboxCard";
import EmailInput from "../EmailInput";
import RegFormFooter from "../RegFormFooter";
import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import SuccessModal from "../SuccessModal";

const initialFormData = {
  phone: "+7",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  birthdayDate: "",
  region: "",
  location: "",
  gender: "",
  card: "",
  hasNoCard: false,
  email: "",
};

const RegistrationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleClose = (): void => {
    setFormData(initialFormData);
    router.back();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { id, type } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;

    if (invalidFormMessage) setInvalidFormMessage("");

    if (id === "hasCard" && value === true) {
      setFormData((prev) => ({ ...prev, hasCard: true, card: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isFormValid = () => validateRegisterFormData(formData).isValid;

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInvalidFormMessage("");

    const validation = validateRegisterFormData(formData);

    if (!validation.isValid) {
      setInvalidFormMessage(
        validation.errorMessage || "Заполните поля корректно",
      );
      setIsLoading(false);
      return;
    }

    try {
      const [day, month, year] = formData.birthdayDate.split(".");
      const formattedBirthdayDate = new Date(`${year}-${month}-${day}`);

      const userData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
        birthdayDate: formattedBirthdayDate,
      };

      const response = await fetch("api/register", {
        method: "POST",
        headers: { "content-type": "application-json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка регистрации");
      }

      setIsSuccess(true);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Ошибка регистрации, попробуйте снова",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  if (isSuccess) return <SuccessModal />;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen 
      text-[#414141]"
    >
      <div
        className="bg-white rounded shadow-auth-form w-full max-w-[687px] max-h-screen 
          overflow-y-auto"
      >
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8"
            aria-label="Закрыть"
          >
            <Image
              src="/icons-auth/icon-form-close.svg"
              alt="Закрыть форму"
              width={24}
              height={24}
              sizes="24px"
            />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center mb-10">Регистрация</h1>
        <h2 className="text-lg font-bold text-center mb-6">
          Обязательные поля
        </h2>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className=" w-full max-w-[552px] mx-auto max-h-screen flex flex-col justify-center 
            overflow-y-hidden"
        >
          <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex flex-col gap-y-4 items-start">
              <PhoneInput
                value={formData.phone}
                onChangeAction={handleChange}
              />
              <NameInput
                id="lastName"
                label="Фамилия"
                value={formData.lastName}
                onChange={handleChange}
              />
              <NameInput
                id="firstName"
                label="Имя"
                value={formData.firstName}
                onChange={handleChange}
              />
              <PasswordInput
                id="password"
                label="Пароль"
                value={formData.password}
                onChangeAction={handleChange}
                showPassword={showPassword}
                togglePasswordVisibilityAction={() =>
                  setShowPassword(!showPassword)
                }
                showRequirements={true}
              />
              <PasswordInput
                id="confirmPassword"
                label="Подтвердите пароль"
                value={formData.confirmPassword}
                onChangeAction={handleChange}
                showPassword={showPassword}
                togglePasswordVisibilityAction={() =>
                  setShowPassword(!showPassword)
                }
                compareWith={formData.password}
              />
            </div>
            <div className="flex flex-col gap-y-4 items-start">
              <DateInput
                value={formData.birthdayDate}
                onChangeAction={(value) =>
                  setFormData((prev) => ({ ...prev, birthdayDate: value }))
                }
              />
              <SelectRegion
                value={formData.region}
                onChangeAction={handleChange}
              />
              <SelectCity
                value={formData.location}
                onChangeAction={handleChange}
              />
              <GenderSelect
                value={formData.gender}
                onChangeAction={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              />
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-6 mt-10">
            Необязательные поля
          </h2>
          <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex flex-col w-65 gap-y-4">
              <CardInput
                value={formData.card}
                onChangeAction={handleChange}
                disabled={formData.hasNoCard}
              />
              <CheckboxCard
                checked={formData.hasNoCard}
                onChangeAction={handleChange}
              />
            </div>
            <EmailInput value={formData.email} onChangeAction={handleChange} />
          </div>
          {invalidFormMessage && (
            <div className="text-red-500 text-center mt-5 p-4 bg-red-50 rounded">
              {invalidFormMessage}
            </div>
          )}
          <RegFormFooter isFormValid={isFormValid()} isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
