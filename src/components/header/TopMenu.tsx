"use client";

import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

import iconCart from "../../../public/icons-header/icon-cart.svg";
import IconMenuMob from "../svg/IconMenuMob";
import IconBox from "../svg/IconBox";
import IconHeart from "../svg/IconHeart";

const TopMenu = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const isCatalogPage = pathname === "/catalog";
  const isFavoritesPage = pathname === "/favorites";

  const isManagerOrAdmin = user?.role === "admin" || user?.role === "manager";

  return (
    <ul className="flex flex-row gap-x-6 items-end text-main-text">
      <li className="flex flex-col items-center gap-2.5 md:hidden w-11 h-auto cursor-pointer">
        <Link href="/catalog">
          <IconMenuMob isCatalogPage={isCatalogPage} />
          <span
            className={`${isCatalogPage ? "text-secondary" : "text-main-text"}`}
          >
            Каталог
          </span>
        </Link>
      </li>
      {!isManagerOrAdmin && (
        <li>
          <Link
            href="/favorites"
            className="flex flex-col items-center gap-2.5 w-11 h-auto cursor-pointer"
          >
            <IconHeart isActive={isFavoritesPage} />
            <span
              className={`${isFavoritesPage ? "text-secondary" : ""}`}
            >
              Избранное
            </span>
          </Link>
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
