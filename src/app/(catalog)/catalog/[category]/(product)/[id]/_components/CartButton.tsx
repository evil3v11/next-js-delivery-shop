import Image from "next/image";

const CartButton = () => {
  return (
    <button
      className="w-full bg-secondary text-white text-xl md:text-2xl p-4 flex justify-between items-center 
       rounded cursor-pointer shadow-button-default hover:shadow-button-secondary active:shadow-button-active
      hover:bg-secondary/80 duration-300"
    >
      <Image
        src="/icons-products/icon-shopping-cart.svg"
        alt="Добавить в корзину"
        width={32}
        height={32}
        sizes="32px"
      />
      <span className="flex-1">В корзину</span>
    </button>
  );
};

export default CartButton;
