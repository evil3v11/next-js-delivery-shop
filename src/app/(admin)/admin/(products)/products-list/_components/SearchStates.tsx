import { Search, Loader } from "lucide-react";

interface SearchStatesProps {
  hasSearched: boolean;
  isLoading: boolean;
}

const SearchStates = ({ hasSearched, isLoading }: SearchStatesProps) => {
  if (!hasSearched && !isLoading) {
    return (
      <div className="text-center py-12 text-main-text">
        <Search size={48} className="mx-auto mb-4 text-[#bfbfbf]" />
        <p className="text-lg">Введите запрос для поиска товаров</p>
        <p className="text-sm">Найдите товары по названию или артикулу</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader size={32} className="mx-auto animate-spin text-primary" />
        <p className="mt-2">Поиск товаров...</p>
      </div>
    );
  }

  return null;
};

export default SearchStates;
