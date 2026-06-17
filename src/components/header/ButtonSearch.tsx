import Image from "next/image";

const ButtonSearch = () => {
  return (
    <button className="bg-primary hover:shadow-button-default active:shadow-button-active
    hidden md:flex w-10 lg:w-35 p-2 rounded cursor-pointer duration-300 gap-4">
      <Image
        src="/icons-header/icon-menu.svg"
        alt="menu"
        width={24}
        height={24}
        className="hidden md:block"
      />
      <span className="text-base text-white hidden lg:block">Каталог</span>
    </button>
  );
};

export default ButtonSearch;
