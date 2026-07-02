import { validateBirthdayDate } from "./validateBirthdayDate";

export const validateRegisterFormData = (formData: {
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  birthdayDate: string;
  region: string;
  location: string;
  gender: string;
  card?: string;
  hasNoCard?: boolean;
  email?: string;
}): { isValid: boolean; errorMessage?: string } => {
  if (!formData.phone || formData.phone.replace(/\D/g, "").length !== 11) {
    return {
      isValid: false,
      errorMessage: "Введите корректный номер телефона (11 цифр)",
    };
  }

  if (
    !formData.lastName ||
    !/^[а-яА-ЯЁa-zA-Z-]{2,}$/.test(formData.lastName.trim())
  ) {
    return {
      isValid: false,
      errorMessage: "Фамилия должна содержать минимум 2 буквы",
    };
  }

  if (
    !formData.firstName ||
    !/^[а-яА-ЯЁa-zA-Z-]{2,}$/.test(formData.firstName.trim())
  ) {
    return {
      isValid: false,
      errorMessage: "Имя должно содержать минимум 2 буквы",
    };
  }

  if (
    !formData.password ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)
  ) {
    return {
      isValid: false,
      errorMessage:
        "Пароль должен быть длиннее 5 буквы и цифр, и включать хотя бы одну заглавную букву",
    };
  }

  if (formData.confirmPassword !== formData.password) {
    return {
      isValid: false,
      errorMessage:
        "Пароли не совпадают, проверьте правильность введеных паролей",
    };
  }

  const birthdayDateValidation = validateBirthdayDate(formData.birthdayDate);
  if (!birthdayDateValidation.isValid) {
    return {
      isValid: false,
      errorMessage:
        birthdayDateValidation.error || "Некорректная дата рождения",
    };
  }

  if (!formData.region) {
    return {
      isValid: false,
      errorMessage: "Выберите регион",
    };
  }

  if (!formData.location) {
    return {
      isValid: false,
      errorMessage: "Выберите город",
    };
  }

  if (!formData.gender) {
    return {
      isValid: false,
      errorMessage: "Выберите пол",
    };
  }

  if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return {
      isValid: false,
      errorMessage: "Неправильный e-mail",
    };
  }

  if (
    !formData.hasNoCard &&
    formData.card &&
    !/^\d{16}$/.test(formData.card.replace(/\s/g, ""))
  ) {
    return {
      isValid: false,
      errorMessage: "Номер карты должен содержать 16 цифр",
    };
  }

  return { isValid: true };
};
