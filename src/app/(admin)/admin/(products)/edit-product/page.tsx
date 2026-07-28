import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const AdminEditPage = () => {
  return (
    <div className="container flex flex-col items-center px-4 py-8 text-main-text mx-auto">
      <Link
        href="/admin/products/products-list"
        className="hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base self-start"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        Для редактиврования найдите товар
      </Link>
      <h1 className="text-3xl font-bold mb-8">Изменить товар</h1>
    </div>
  );
};

export default AdminEditPage;
