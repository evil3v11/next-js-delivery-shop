export const isBirthdaySoon = (birthdayDate: string): boolean => {
  try {
    const birthday = new Date(birthdayDate);
    const now = new Date();

    const currentYearBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
    );

    const timeDifference = currentYearBirthday.getTime() - now.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // ms * sec * min * hr

    return dayDifference <= 3 && dayDifference >= 0;
  } catch {
    return false;
  }
};
