"use client";

import { useAuthStore } from "@/store/authStore";

import Image from "next/image";
import Link from "next/link";

import iconArrow from "../../../public/icons-header/icon-arrow.svg";
import { useEffect, useRef, useState } from "react";
import { getAvatarByGender } from "@/utils/getAvatarByGender";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { isAuth, user, logout, checkAuth, isLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLogginOut, setIsLogginOut] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      setIsLogginOut(true);
      await logout();
      router.replace("/");
    } catch (e) {
      console.log("Не удалось выйти: ", e);
    } finally {
      setIsLogginOut(false);
      setIsMenuOpen(false);
    }
  };

  if (isLoading)
    return (
      <div className="ml-6 w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
    );

  if (!isAuth) {
    return (
      <Link
        href="/login"
        className="ml-6 w-10 xl:w-[157px] flex justify-between items-center gap-x-2 p-2 rounded
        text-white text-base bg-[#ff6633] hover:shadow-article active:shadow-button-active
        duration-300"
      >
        <div className="w-[109px] justify-center hidden xl:flex">
          <p>Войти</p>
        </div>
        <Image
          src="/icons-header/icon-entry.svg"
          alt="Войти"
          width={24}
          height={24}
          sizes="24px"
        />
      </Link>
    );
  }

  return (
    <div
      className="ml-6 p-2 flex flex-1 justify-end items-center gap-2.5 relative"
      ref={menuRef}
    >
      <div className="flex" onClick={toggleMenu}>
        <Image
          src={getAvatarByGender(user?.gender)}
          alt="Ваш профиль"
          width={40}
          height={40}
          className="min-w-10 min-h-10 cursor-pointer"
        />
        <p className="hidden xl:block cursor-pointer p-2.5">
          {isLoading ? "Загрузка..." : user?.name}
        </p>
        <div className="hidden xl:block cursor-pointer p-2">
          <Image
            src={iconArrow}
            alt="Меню профиля"
            height={24}
            width={24}
            sizes="24px"
            className={`transform transition-transform duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>
      <div
        className={`absolute min-w-[200px] shadow-button-secondary z-50 flex flex-col items-start 
        justify-center bg-white text-[#414141] text-[15px] rounded transition-all duration-300
        ${isMobile ? "bottom-full mb-1" : "top-full mt-5"}
        ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href="/profile"
          className="hover:text-[#ff6633] duration-300 px-4 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Профиль
        </Link>
        <Link
          href="/"
          className="hover:text-[#ff6633] duration-300 px-4 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Главная
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLogginOut}
          className="cursor-pointer hover:text-[#ff6633] duration-300 px-4 py-2 w-full text-left border-t border-t-gray-200"
        >
          {isLogginOut ? "Выход..." : "Выйти"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
