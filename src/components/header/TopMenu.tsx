"use client";

import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

import iconHeart from "../../../public/icons-header/icon-heart.svg";
import iconCart from "../../../public/icons-header/icon-cart.svg";
import IconMenuMob from "../svg/IconMenuMob";
import IconBox from "../svg/IconBox";

const TopMenu = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const isCatalogPage = pathname === "/catalog";

  const isManagerOrAdmin = user?.role === "admin" || user?.role === "manager";

  return (
    <ul className="flex flex-row gap-x-6 items-end">
      <Link href="/catalog">
        <li className="flex flex-col items-center gap-2.5 md:hidden w-11 h-auto cursor-pointer">
          <IconMenuMob isCatalogPage={isCatalogPage} />
          <span
            className={`${isCatalogPage ? "text-secondary" : "text-main-text"}`}
          >
            Каталог
          </span>
        </li>
      </Link>
      {!isManagerOrAdmin && (
        <li className="flex flex-col items-center gap-2.5 w-11 h-auto cursor-pointer">
          <Image src={iconHeart} alt="Избранное" width={24} height={24} />
          <span>Избранное</span>
        </li>
      )}
      <li className="flex flex-col items-center gap-2.5 w-11 h-auto cursor-pointer">
        <IconBox isManagerOrAdmin={isManagerOrAdmin} />
        <span className={isManagerOrAdmin ? "text-secondary" : ""}>Заказы</span>
      </li>
      {!isManagerOrAdmin && (
        <li className="flex flex-col items-center gap-2.5 w-11 h-auto cursor-pointer">
          <Image src={iconCart} alt="Корзина" width={24} height={24} />
          <span>Корзина</span>
        </li>
      )}
    </ul>
  );
};

export default TopMenu;
