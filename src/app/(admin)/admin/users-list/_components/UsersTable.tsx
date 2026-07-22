"use client";

import { SortUsersBy } from "@/types/AdminPanelUsersListSortBy";
import { UserData } from "@/types/userData";

import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import UserListPagination from "./UserListPagination";

interface UsersTableProps {
  users: UserData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: SortUsersBy;
  sortDirection: "asc" | "desc";
  onSort: (field: SortUsersBy, direction: "asc" | "desc") => void;
}

const UsersTable = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  sortBy,
  sortDirection,
  onSort,
}: UsersTableProps) => {
  return (
    <>
      <div className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden">
        <TableHeader
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <div className="divide-y divide-gray-200 flex flex-col border-b border-gray-200">
          {users.map((user) => (
            <TableRow key={user?.id} user={user} />
          ))}
        </div>
      </div>
      <UserListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default UsersTable;
