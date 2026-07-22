import { tableStyles } from "../../styles";

const RegisterDate = ({ createdAt }: { createdAt: string }) => {
  return (
    <div
      className={`${tableStyles.colSpans.registration} border-b border-b-gray-300 md:border-b-0 order-7 flex 
      items-center gap-x-3 py-3`}
    >
      <div className="text-xs font-semibold md:hidden">Регистрация:</div>
      <div className="text-xs ">
        {new Date(createdAt).toLocaleDateString("ru-RU")}
      </div>
      <div className="text-xs text-gray-300">
        {new Date(createdAt).toLocaleTimeString("ru-RU")}
      </div>
    </div>
  );
};

export default RegisterDate;
