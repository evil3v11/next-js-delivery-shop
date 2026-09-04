import { Plus, FolderTree, Tags, FileText, Brain } from "lucide-react";
import { DashboardCard } from "../_types/dashboard";

export const dashboardCards: DashboardCard[] = [
  {
    id: "new-article",
    title: "Новая статья",
    description: "Создать статью в редакторе",
    icon: <Plus className="w-6 h-6" />,
    color: "blue",
    path: "/admin/cms/articles/editor",
    actionText: "Создать",
  },
  {
    id: "all-articles",
    title: "Все статьи",
    description: "Просмотр и управление статьями",
    icon: <FileText className="w-6 h-6" />,
    color: "indigo",
    path: "/admin/cms/articles/manage-articles",
    actionText: "Перейти",
  },
  {
    id: "categories",
    title: "Категории",
    description: "Управление категориями блога",
    icon: <FolderTree className="w-6 h-6" />,
    color: "green",
    path: "/admin/cms/categories",
    actionText: "Управлять",
  },
  {
    id: "semantic-core",
    title: "Семантическое ядро",
    description: "Ключевые слова и SEO",
    icon: <Tags className="w-6 h-6" />,
    color: "purple",
    path: "/admin/cms/semantic-core",
    actionText: "Настроить",
  },
  {
    id: "article-generation",
    title: "Генерация статей",
    description: "Генерация статей с помощью AI",
    icon: <Brain className="w-6 h-6" />,
    color: "orange",
    path: "/admin/cms/articles/generate",
    actionText: "Сгенерировать",
  },
];
