import { getShortDecimalId } from "@/utils/admin/getShortDecimalId";

import { tableStyles } from "../../styles";

const UserId = ({ userId }: { userId: string }) => {
  return (
    <div
      className={`${tableStyles.colSpans.id} ${tableStyles.border.right} border-b border-b-gray-300 
      md:border-b-0 order-1 flex flex-row gap-x-3 py-3`}
    >
      <div className="text-xs font-semibold md:hidden">ID:</div>
      <span
        className="font-mono text-xs flex lg:text-sm lg:bg-[#f3f2f1] justify-start md:justify-center 
      rounded px-2 py-1"
      >
        #{getShortDecimalId(userId)}
      </span>
    </div>
  );
};

export default UserId;
