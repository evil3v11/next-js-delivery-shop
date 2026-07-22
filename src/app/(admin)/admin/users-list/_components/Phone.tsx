import { maskPhone } from "@/utils/admin/maskPhone";
import { tableStyles } from "../../styles";

const Phone = ({
  phone,
  isPhoneVerified,
}: {
  phone: string;
  isPhoneVerified: boolean;
}) => {
  return (
    <div
      className={`${tableStyles.colSpans.phone} ${tableStyles.border.right} border-b border-gray-300
        md:border-b-0 order-4 gap-2`}
    >
      <div className="text-xs font-semibold flex md:hidden">Телефон:</div>
      <div
        className={`text-xs ${isPhoneVerified ? "text-primary" : "text-[#d80000]"}`}
      >
        {maskPhone(phone)}
      </div>
    </div>
  );
};

export default Phone;
