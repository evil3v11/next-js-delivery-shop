import Image from "next/image";
import iconSearch from "../../../public/icons-header/icon-search.svg";

const InputBlock = () => {
  return (
    <div className=" relative min-w-[261px] grow">
      <input
        type="text"
        placeholder="Найти товар"
        className="w-full h-10 rounded p-2 outline-1 outline-primary focus:shadow-button-default text-[#8f8f8f] text-base leading-[150%]"
      />
      <button className="absolute right-2 top-2 cursor-pointer">
        <Image src={iconSearch} alt="Поиск" height={24} width={24} />
      </button>
    </div>
  );
};

export default InputBlock;
