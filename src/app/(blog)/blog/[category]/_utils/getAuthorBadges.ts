import { ArticleComment } from "../../_types";

type Badge = {
  text: "Админ" | "Менеджер";
  className: string;
};

export const getAuthorBadges = (comment: ArticleComment): Badge[] => {
  const badges: Badge[] = [];

  if (comment.authorRole === "admin") {
    badges.push({
      text: "Админ",
      className: "bg-red-100 text-red-700 border border-red-200",
    });
  } else if (comment.authorRole === "manager") {
    badges.push({
      text: "Админ",
      className: "bg-green-100 text-green-700 border border-green-200",
    });
  }

  return badges;
};
