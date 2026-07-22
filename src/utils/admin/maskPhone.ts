export const maskPhone = (phone: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  let formattedPhone = "+7";

  if (cleanPhone.length > 1) formattedPhone += ` (${cleanPhone.slice(1, 4)}) `;
  if (cleanPhone.length > 4) formattedPhone += `${cleanPhone.slice(4, 7)}-`;
  if (cleanPhone.length > 7) formattedPhone += `${cleanPhone.slice(7, 9)}-`;
  if (cleanPhone.length > 9) formattedPhone += `${cleanPhone.slice(9, 11)}`;

  return formattedPhone;
};
