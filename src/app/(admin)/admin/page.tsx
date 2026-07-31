import { buttonStyles } from "@/app/styles";

import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      <div className="flex flex-col gap-y-3 items-center text-center">
        <Link
          href="/admin/users-list"
          className={`${buttonStyles.active} px-4 py-3 rounded w-full`}
        >
          Управления пользователями
        </Link>
        <Link
          href="/admin/add-product"
          className={`${buttonStyles.active} px-4 py-3 rounded w-full`}
        >
          Добавить новый товар
        </Link>
        <Link
          href="/admin/products-list"
          className={`${buttonStyles.active} px-4 py-3 rounded w-full`}
        >
          Список товаров
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
