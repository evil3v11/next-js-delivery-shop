export const getBonusWord = (bonus: number): string => {
  if (bonus % 10 === 1 && bonus % 100 !== 11) {
    return "бонус";
  } else if (
    [2, 3, 4].includes(bonus % 10) &&
    [12, 13, 14].includes(bonus % 100)
  ) {
    return "бонуса";
  } else {
    return "бонусов";
  }
};
