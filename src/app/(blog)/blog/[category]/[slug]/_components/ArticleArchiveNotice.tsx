import { AlertCircle, Clock } from "lucide-react";

const ArticleArchiveNotice = ({
  message = "Статья находится в архиве. Информация может быть устаревшей.",
  className = "",
  lastUpdated = "Неизвестно",
}: {
  message?: string;
  className?: string;
  lastUpdated?: string;
}) => (
  <div
    role="alert"
    aria-live="polite"
    className={`flex flex-col gap-3 items-start gap-x-3 mb-4 p-3 rounded text-sm bg-yellow-50 border 
    border-yellow-200 text-yellow-800 ${className}`}
  >
    <div className="flex items-center gap-2">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <p className="mt-1">{message}</p>
    </div>
    <div>
      <div className="flex items-center gap-x-2 mt-2 text-sm opacity-75">
        <Clock className="h-3 w-3" />
        <span>
          Последнее обновление:{" "}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : "неизвестно"}
        </span>
      </div>
    </div>
  </div>
);

export default ArticleArchiveNotice;
