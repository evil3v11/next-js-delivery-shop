import { UserData } from "@/types/userData";

import UserId from "./UserId";
import Person from "./Person";
import Age from "./Age";
import Email from "./Email";
import Phone from "./Phone";
import Role from "./Role";
import RegisterDate from "./RegisterDate";

const TableRow = ({ user }: { user: UserData }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-3 py-1 duration-300 hover:bg-gray-50 
    hover:shadow-lg rounded"
    >
      <UserId userId={user.id} />
      <Person
        name={user.name}
        lastName={user.lastName}
        birthdayDate={user.birthdayDate}
      />
      <Age birthdayDate={user.birthdayDate} />
      <Email email={user.email} isEmailVerified={user.emailVerified} />
      <Phone
        phone={user.phoneNumber}
        isPhoneVerified={user.phoneNumberVerified}
      />
      <Role initialRole={user.role} userId={user.id} />
      <RegisterDate createdAt={user.createdAt} />
    </div>
  );
};

export default TableRow;
