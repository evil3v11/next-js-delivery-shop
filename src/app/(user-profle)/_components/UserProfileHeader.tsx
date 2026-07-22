const UserProfileHeader = ({
  name,
  lastName,
}: {
  name: string;
  lastName: string;
}) => {
  return (
    <div className="bg-linear-to-r from-secondary to-primary rounded-t-lg text-white px-5 py-7 flex flex-col gap-y-3">
      <h1 className="text-4xl font-bold">
        Профиль пользователя: {name} {lastName}
      </h1>
      <p className="text-md">Управление Вашей учетной записью</p>
    </div>
  );
};

export default UserProfileHeader;
