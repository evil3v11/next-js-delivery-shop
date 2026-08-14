export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "admin":
      return "(администратор)";
    case "manager":
      return "(менеджер)";
    case "courier":
      return "(доставщик)";
    default:
      return "(пользователь)";
  }
};
