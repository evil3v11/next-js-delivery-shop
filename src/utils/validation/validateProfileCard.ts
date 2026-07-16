export const cleanCardNumber = (cardNumber: string): string =>
  cardNumber.replace(/\D/g, "");

export const isCardNumberValid = (cardNumber: string): boolean =>
  /^\d{16}$/.test(cardNumber);

export const formatCardNumber = (
  cardNumber: string,
  isEditing: boolean = false,
): string => {
  const cleanCard = cleanCardNumber(cardNumber);
  if (!cleanCard) return "";

  if (!isEditing) {
    if (cleanCard.length <= 4) return cleanCard;
    return `**** **** **** ${cleanCard.slice(-4)}`;
  }

  if (cleanCard.length <= 4) return cleanCard;
  if (cleanCard.length <= 8)
    return `${cleanCard.slice(0, 4)} ${cleanCard.slice(4)}`;
  if (cleanCard.length <= 12)
    return `${cleanCard.slice(0, 4)} ${cleanCard.slice(4, 8)} ${cleanCard.slice(8)}`;
  return `${cleanCard.slice(0, 4)} ${cleanCard.slice(4, 8)} ${cleanCard.slice(8, 12)} ${cleanCard.slice(12)}`;
};
