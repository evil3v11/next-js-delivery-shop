import { CONFIG } from "../../../../../../config/config";

import { tableStyles } from "../../styles";

const Email = ({
  email,
  isEmailVerified,
}: {
  email: string;
  isEmailVerified: boolean;
}) => {
  const isTemporaryEmail = (email: string): boolean =>
    email.includes(CONFIG.TEMP_EMAIL_DOMAIN);

  return (
    <div
      className={`${tableStyles.colSpans.email} ${tableStyles.border.right} border-b border-gray-300
      md:border-b-0 order-4 gap-2`}
    >
      <div className="text-xs font-semibold flex md:hidden">Email:</div>
      {!isTemporaryEmail(email) ? (
        <div
          className={`text-xs break-all flex items-center 
            ${isEmailVerified ? "text-primary" : "text-[#d80000]"}`}
        >
          {email}
        </div>
      ) : (
        <div className="md:text-sm flex items-center">-</div>
      )}
    </div>
  );
};

export default Email;
