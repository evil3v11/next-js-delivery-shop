import { formatBirthday } from "@/utils/admin/formatBirthday";
import { isBirthdaySoon } from "@/utils/admin/isBirthdaySoon";
import { Cake } from "lucide-react";
import { tableStyles } from "../../styles";

interface PersonProps {
  name: string;
  lastName: string;
  birthdayDate: string;
}

const Person = ({ name, lastName, birthdayDate }: PersonProps) => {
  const birthdaySoon = isBirthdaySoon(birthdayDate);
  return (
    <div
      className={`border-b border-gray-300 md:border-b-0 order-2 flex flex-row md:flex-col md:items-start 
        gap-x-3 gap-y-2 ${tableStyles.colSpans.name} ${tableStyles.border.right}`}
    >
      <div className="text-xs lg:text-sm font-medium md:text-left">
        {name} {lastName}
      </div>
      {birthdaySoon && (
        <span className="inline-flex items-center gap-2 text-secondary text-xs md:justify-start">
          <Cake className="h-4 w-4" />
          {formatBirthday(birthdayDate)}
        </span>
      )}
    </div>
  );
};

export default Person;
