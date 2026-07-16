export const checkAvatarExistence = async (
  userId: string,
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/users/avatar/${userId}/check-avatar`);
    const data = await response.json();
    return data.exists;
  } catch {
    return false;
  }
};
