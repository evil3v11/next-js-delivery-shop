"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegFormContext } from "@/app/contexts/RegFormContext";

import { RegFormData } from "@/types/regFormData";
import { initialRegFormData } from "@/constants/regFormData";

import { validateRegisterFormData } from "@/utils/validation/form";

import PhoneInput from "../../_components/PhoneInput";
import NameInput from "../_components/NameInput";
import PasswordInput from "../../_components/PasswordInput";
import DateInput from "../_components/DateInput";
import SelectRegion from "../_components/SelectRegion";
import SelectCity from "../_components/SelectCity";
import GenderSelect from "../_components/GenderSelect";
import CardInput from "../_components/CardInput";
import CheckboxCard from "../_components/CheckboxCard";
import EmailInput from "../_components/EmailInput";
import RegFormFooter from "../_components/RegFormFooter";
import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import AuthFormLayout from "../../_components/AuthFormLayout";
import VerificationMethodModal from "../_components/VerificationMethodModal";

const RegistrationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [registerForm, setRegisterForm] =
    useState<RegFormData>(initialRegFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { setRegFormData } = useRegFormContext();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && !registerForm.email) {
      router.replace("/verify/verify-phone");
    }
  }, [isSuccess, registerForm.email, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { id, type } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;

    if (invalidFormMessage) setInvalidFormMessage("");

    if (id === "hasCard" && value === true) {
      setRegisterForm((prev) => ({ ...prev, hasCard: true, card: "" }));
      return;
    }

    setRegisterForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInvalidFormMessage("");

    const validation = validateRegisterFormData(registerForm);

    if (!validation.isValid) {
      setInvalidFormMessage(
        validation.errorMessage || "Заполните поля корректно",
      );
      setIsLoading(false);
      return;
    }

    try {
      const [day, month, year] = registerForm.birthdayDate.split(".");
      const formattedBirthdayDate = new Date(`${year}-${month}-${day}`);

      const userData = {
        ...registerForm,
        phoneNumber: registerForm.phoneNumber.replace(/\D/g, ""),
        birthdayDate: formattedBirthdayDate.toISOString(),
      };

      setRegFormData(userData);
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

  const isFormValid = () => validateRegisterFormData(registerForm).isValid;

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  if (isSuccess && registerForm.email) return <VerificationMethodModal />;

  return (
    <AuthFormLayout variant="register">
      <h1 className="text-2xl font-bold text-center mb-10 mt-10">
        Регистрация
      </h1>
      <h2 className="text-lg font-bold text-center mb-6">Обязательные поля</h2>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-[552px] mx-auto flex flex-col justify-center overflow-y-hidden -mb-10"
      >
        <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-4 items-start">
            <PhoneInput
              value={registerForm.phoneNumber}
              onChangeAction={handleChange}
            />
            <NameInput
              id="lastName"
              label="Фамилия"
              value={registerForm.lastName}
              onChange={handleChange}
            />
            <NameInput
              id="name"
              label="Имя"
              value={registerForm.name}
              onChange={handleChange}
            />
            <PasswordInput
              id="password"
              label="Пароль"
              value={registerForm.password}
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
              value={registerForm.confirmPassword}
              onChangeAction={handleChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
              compareWith={registerForm.password}
            />
          </div>
          <div className="flex flex-col gap-y-4 items-start">
            <DateInput
              value={registerForm.birthdayDate}
              onChangeAction={(value) =>
                setRegisterForm((prev) => ({ ...prev, birthdayDate: value }))
              }
            />
            <SelectRegion
              value={registerForm.region}
              onChangeAction={handleChange}
            />
            <SelectCity
              value={registerForm.location}
              onChangeAction={handleChange}
            />
            <GenderSelect
              value={registerForm.gender}
              onChangeAction={(value) =>
                setRegisterForm((prev) => ({ ...prev, gender: value }))
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
              value={registerForm.card}
              onChangeAction={handleChange}
              disabled={!!registerForm.hasNoCard}
            />
            <CheckboxCard
              checked={registerForm.hasNoCard}
              onChangeAction={handleChange}
            />
          </div>
          <EmailInput
            value={registerForm.email}
            onChangeAction={handleChange}
          />
        </div>
        {invalidFormMessage && (
          <div className="text-red-500 text-center mt-5 p-4 bg-red-50 rounded">
            {invalidFormMessage}
          </div>
        )}
        <RegFormFooter isFormValid={isFormValid()} isLoading={isLoading} />
      </form>
    </AuthFormLayout>
  );
};

export default RegistrationPage;
