"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

import Link from "next/link";
import IconMenuMob from "../svg/IconMenuMob";
import IconBox from "../svg/IconBox";
import IconHeart from "../svg/IconHeart";
import IconCart from "../svg/IconCart";

const TopMenu = () => {
  const { user } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const pathname = usePathname();
  const isCatalogPage = pathname === "/catalog";
  const isFavoritesPage = pathname === "/favorites";
  const isCartPage = pathname === "/cart";
  const isUserOrdersPage = pathname === "/orders";
  const isAdminOrdersPage = pathname === "/admin/orders";
  const isOrdersPage = isUserOrdersPage || isAdminOrdersPage

  const isManagerOrAdmin = user?.role === "admin" || user?.role === "manager";
  const ordersPageLink = isManagerOrAdmin ? "/admin/orders" : "/orders"

  useEffect(() => {
    if (user && !isManagerOrAdmin) fetchCart();
  }, [user, isManagerOrAdmin, fetchCart]);

  return (
    <ul className="flex flex-row gap-x-6 items-end text-main-text">
      <li>
        <Link
          href="/catalog"
          className="flex flex-col items-center gap-2.5 md:hidden w-11 h-auto cursor-pointer"
        >
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
            className="flex flex-col items-center gap-2.5 w-11 h-auto"
          >
            <IconHeart isActive={isFavoritesPage} />
            <span className={`${isFavoritesPage ? "text-secondary" : ""}`}>
              Избранное
            </span>
          </Link>
        </li>
      )}
      <li>
        <Link
          href={ordersPageLink}
          className="flex flex-col items-center gap-2.5 w-11 h-auto"
        >
          <IconBox isActive={isOrdersPage} />
          <span className={isOrdersPage ? "text-secondary" : ""}>Заказы</span>
        </Link>
      </li>
      {!isManagerOrAdmin && (
        <li className="relative flex flex-col items-center gap-2.5 w-11 cursor-pointer">
          <Link
            href="/cart"
            className="flex flex-col items-center gap-2.5 w-11 h-auto"
          >
            <IconCart isActive={isCartPage} />
            {totalItems > 0 && (
              <span className="absolute -top-2 right-0 bg-secondary text-white text-[9px] rounded w-4 h-4 
              flex items-center justify-center py-0.5 px-1">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className={`${isCartPage ? "text-secondary" : ""}`}>
              Корзина
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
};

export default TopMenu;
