import { calculateAge } from "@/utils/admin/calculateAge";
import { tableStyles } from "../../styles";

const Age = ({ birthdayDate }: { birthdayDate: string }) => {
  const age = calculateAge(birthdayDate);
  return (
    <div
      className={`${tableStyles.colSpans.age} ${tableStyles.border.right} text-xs border-b border-gray-300 
      md:border-b-0 order-3`}
    >
      {age === "-" ? (
        "-"
      ) : (
        <>
          {age}
          <span className="md:hidden ml-1">лет</span>
        </>
      )}
    </div>
  );
};

export default Age;
