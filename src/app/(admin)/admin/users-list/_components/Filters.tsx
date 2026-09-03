"use client";

import { useAuthStore } from "@/store/authStore";
import { FiltersState } from "@/types/props";

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (field: keyof FiltersState, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const Filters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: FiltersProps) => {
  const { user: currentUser } = useAuthStore();

  const isAdmin = currentUser?.role === "admin";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    onFilterChange(name as keyof FiltersState, value);
  };

  return (
    <div className="bg-white rounded p-5 mb-5 shadow-lg flex flex-col">
      <div className="flex justify-between">
        <h3 className="font-bold">Фильтры</h3>
        <div className="flex gap-x-5 text-xs">
          <button
            onClick={onApplyFilters}
            className="px-3 py-2 bg-secondary/50 hover:bg-secondary text-gray-800 hover:text-white 
          rounded cursor-pointer duration-300 shadow-md"
          >
            Найти
          </button>
          <button
            onClick={onClearFilters}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer duration-300 shadow-md"
          >
            Очистить
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">ID</label>
          <input
            name="id"
            value={filters.id}
            onChange={handleInputChange}
            placeholder="Поиск по ID"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Имя</label>
          <input
            name="name"
            value={filters.name}
            onChange={handleInputChange}
            placeholder="Поиск по имени"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Фамилия</label>
          <input
            name="lastName"
            value={filters.lastName}
            onChange={handleInputChange}
            placeholder="Поиск по фамилии"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Email</label>
          <input
            name="email"
            value={filters.email}
            onChange={handleInputChange}
            placeholder="Поиск по почте"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Телефон</label>
          <input
            name="phoneNumber"
            value={filters.phoneNumber}
            onChange={handleInputChange}
            placeholder="Поиск по телефону"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Роль</label>
          <select
            name="role"
            value={filters.role}
            onChange={handleInputChange}
            className="gap-1 border border-gray-200 rounded px-2 py-2 cursor-pointer"
          >
            <option value="">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="manager">Менеджер</option>
            {isAdmin && <option value="admin">Админ</option>}
          </select>
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Возраст от</label>
          <input
            name="minAge"
            type="number"
            min="0"
            value={filters.minAge}
            onChange={handleInputChange}
            placeholder="От"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Возраст до</label>
          <input
            name="maxAge"
            type="number"
            min="0"
            value={filters.maxAge}
            onChange={handleInputChange}
            placeholder="До"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Регистрация от</label>
          <input
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleInputChange}
            placeholder="До"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-xs font-bold">Регистрация до</label>
          <input
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={handleInputChange}
            placeholder="До"
            className="gap-1 border border-gray-200 rounded px-2 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
