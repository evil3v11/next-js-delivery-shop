import { Plus } from "lucide-react";
import Link from "next/link";

const SearchHeader = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end mb-6 text-main-text">
        <Link
          href="/admin/add-product"
          className="bg-primary hover:shadow-button-default active:shadow-button-active rounded text-white 
          cursor-pointer duration-300 px-4 py-2 flex gap-2 items-center justify-center"
        >
          <Plus size={16} />
          Добавить товар
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Поиск товаров</h1>
    </>
  );
};

export default SearchHeader;
