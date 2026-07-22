import { buttonStyles } from "@/app/(auth)/styles";
import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      <div className="">
        <Link
          href="/admin/users-list"
          className={`${buttonStyles.active} [&&]:justify-start px-4 py-3 rounded w-full md:w-1/2`}
        >
          Управления пользователями
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
