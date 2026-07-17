export const deleteUserAccount = async (userId: string): Promise<void> => {
  if (!userId) return;

  const response = await fetch(`/api/auth/delete-account`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) throw new Error("Ошибка удаления пользователя");

  return await response.json();
};
