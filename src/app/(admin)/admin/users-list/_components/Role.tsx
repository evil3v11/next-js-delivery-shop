"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { UserRole } from "@/types/userData";
import { getRoleLabel, getRoleStyles } from "@/utils/admin/roleHelpers";

import { tableStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";

interface RoleProps {
  initialRole: UserRole;
  userId: string;
}

const Role = ({ initialRole, userId }: RoleProps) => {
  const { user: currentUser } = useAuthStore();
  const [isChangingRole, setIsChangingRole] = useState<boolean>(false);
  const [localRole, setLocalRole] = useState<UserRole>(initialRole as UserRole);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalRole(initialRole as UserRole);
  }, [initialRole]);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === initialRole) return;

    try {
      setIsChangingRole(true);

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Ошибка при обновлении роли");

      const data = await response.json();

      if (data.success) setLocalRole(newRole);
      else throw new Error(data.error || "Неизвестная ошибка");
    } catch (e) {
      console.error("Ошибка при смене роли: ", e);
      setLocalRole(initialRole as UserRole);
    } finally {
      setIsChangingRole(false);
    }
  };

  return (
    <div
      className={`${tableStyles.colSpans.role} ${tableStyles.border.right} border-b border-gray-300
      md:border-b-0 order-4 gap-2`}
    >
      <div className="text-xs font-semibold flex md:hidden">Роль: </div>
      {isChangingRole ? (
        <div className="text-xs text-gray-500">
          <MiniLoader />
        </div>
      ) : localRole === "admin" ? (
        <div
          className={`${getRoleStyles(localRole)} inline-flex justify-center items-center h-8 md:flex-1 w-35 
          md:w-30 px-3 md:px-1 lg:px-3 py-2 rounded text-xs md:text-[10px] lg:text-xs font-medium cursor-pointer outline-none`}
        >
          {getRoleLabel(localRole)}
        </div>
      ) : isAdmin ? (
        <select
          value={localRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className={`${getRoleStyles(localRole)} inline-flex justify-center items-center h-8 md:flex-1 w-35 
          md:w-30 px-3 md:px-1 lg:px-3 py-2 rounded text-xs md:text-[10px] lg:text-xs font-medium cursor-pointer outline-none`}
          disabled={isChangingRole}
        >
          <option value="user">Пользователь</option>
          <option value="manager">Менеджер</option>
        </select>
      ) : (
        <div
          className={`${getRoleStyles(localRole)} inline-flex justify-center items-center h-8 md:flex-1 w-35 
          md:w-30 px-3 md:px-1 lg:px-3 py-2 rounded text-xs md:text-[10px] lg:text-xs font-medium cursor-pointer outline-none`}
        >
          {getRoleLabel(localRole)}
        </div>
      )}
    </div>
  );
};

export default Role;
