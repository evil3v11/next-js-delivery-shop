"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { CONFIG } from "../../../../../config/config";

import { UserData } from "@/types/userData";
import { FiltersState } from "@/types/filters";
import { SortUsersBy } from "@/types/AdminPanelUsersListSortBy";

import NavigationAndInfo from "./_components/NavigationAndInfo";
import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import UsersTable from "./_components/UsersTable";
import Filters from "./_components/Filters";

const initialFilters: FiltersState = {
  id: "",
  name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  role: "",
  minAge: "",
  maxAge: "",
  startDate: "",
  endDate: "",
};

const UsersListPage = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState<string>("");
  const [totalPages, setTotalPages] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(CONFIG.DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortUsersBy>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FiltersState>(initialFilters);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const isManager = currentUser?.role === "manager";

  const loadUsers = useCallback(
    async (
      limit: number,
      page: number,
      sortField: SortUsersBy,
      direction: "asc" | "desc",
      filters: FiltersState,
    ): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          isManager: isManager ? "true" : "false",
          sortBy: sortField,
          sortDirection: direction,
        });

        for (const [key, value] of Object.entries(filters)) {
          if (value) queryParams.append(key, value);
        }

        if (currentUser && isManager) {
          queryParams.append("managerRegion", currentUser.region || "");
          queryParams.append("managerLocation", currentUser.location || "");
        }

        const response = await fetch(`/api/admin/users?${queryParams}`);
        if (!response.ok) throw new Error("Ошибка при получении пользователей");
        const { users, totalCount, totalPages } = await response.json();

        if (users) {
          setUsers(users);
          setTotalUsers(totalCount);
          setTotalPages(totalPages);
        }
      } catch (e) {
        console.error("Ошибка при отправке запроса: ", e);
        setError({
          error: e instanceof Error ? e : new Error("Неизвестная ошибка"),
          userMessage: "Ошибка при загрузке списка пользователей",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, isManager],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers(pageSize, currentPage, sortBy, sortDirection, appliedFilters);
  }, [loadUsers, pageSize, currentPage, sortBy, sortDirection, appliedFilters]);

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => setCurrentPage(page);

  const handleSort = (field: SortUsersBy, direction: "asc" | "desc"): void => {
    setSortBy(field);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handleFilterChange = (
    field: keyof FiltersState,
    value: string,
  ): void => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  return (
    <div className="flex flex-col items-around p-10">
      <NavigationAndInfo
        pageSize={pageSize}
        currentPage={currentPage}
        onPageSizeChange={handlePageSizeChange}
        totalUsers={Number(totalUsers)}
      />
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      <UsersTable
        users={users}
        currentPage={currentPage}
        totalPages={Number(totalPages)}
        onPageChange={handlePageChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
};

export default UsersListPage;
