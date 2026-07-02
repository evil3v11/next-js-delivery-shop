export const validateBirthdayDate = (
  dateToValidate: string,
): { isValid: boolean; error?: string } => {
  if (!dateToValidate || dateToValidate.length < 10) {
    return {
      isValid: false,
      error: "Введите полную дату в формате дд.мм.гггг",
    };
  }

  const [day, month, year] = dateToValidate.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();

  const minDate = new Date(1900, 0, 1);
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() - 14);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  )
    return { isValid: false, error: "Некорретная дата" };

  if (date < minDate) {
    return { isValid: false, error: "Дата не может быть раньше 1900 года" };
  }
  if (date > today) {
    return { isValid: false, error: "Дата не может быть в будущем" };
  }
  if (date > maxDate) {
    return { isValid: false, error: "Вам должно быть больше 14 лет" };
  }
  return { isValid: true };
};
