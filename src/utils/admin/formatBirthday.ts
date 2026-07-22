export const formatBirthday = (birthdayDate: string): string => {
  const birthday = new Date(birthdayDate);
  const birthdayDay = birthday.getDate().toString().padStart(2, "0");
  const birthdayMonth = (birthday.getMonth() + 1).toString().padStart(2, "0");
  return `${birthdayDay}.${birthdayMonth}`;
};
