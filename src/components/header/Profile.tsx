"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { checkAvatarExistence } from "@/utils/avatarUtils";
import { getAvatarByGender } from "@/utils/getAvatarByGender";

import iconArrow from "../../../public/icons-header/icon-arrow.svg";

import Image from "next/image";
import Link from "next/link";
import MiniLoader from "../MiniLoader";

const Profile = () => {
  const { isAuth, user, logout, checkAuth, isLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLogginOut, setIsLogginOut] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const menuRef = useClickOutsideModal<HTMLDivElement>(() =>
    setIsMenuOpen(false),
  );
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastUpdate(Date.now());
  }, [user]);

  useEffect(() => {
    const checkAvatar = async () => {
      if (user?.id) {
        try {
          const exists = await checkAvatarExistence(user.id);
          if (exists) {
            setAvatarSrc(`/api/users/avatar/${user.id}?t=${lastUpdate}`);
          } else {
            setAvatarSrc(getAvatarByGender(user.gender));
          }
        } catch {
          setAvatarSrc(getAvatarByGender(user.gender));
        }
      } else if (user?.gender) {
        setAvatarSrc(getAvatarByGender(user.gender));
      }
    };

    checkAvatar();
  }, [user, lastUpdate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const handleAvatarError = () => {
    if (user?.gender) setAvatarSrc(getAvatarByGender(user.gender));
  };

  const getDisplayName = () => {
    if (!user?.name) return <MiniLoader />;

    switch (user?.role) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      default:
        return user?.name;
    }
  };

  const isManagerOrAdmin = user?.role === "admin" || user?.role === "manager";

  if (isLoading)
    return (
      <div className="ml-6 w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
    );

  if (!isAuth) {
    return (
      <Link
        href="/login"
        className="ml-6 w-10 xl:w-[157px] flex justify-between items-center gap-x-2 p-2 rounded
        text-white text-base bg-secondary hover:shadow-article active:shadow-button-active
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
          src={avatarSrc || getAvatarByGender(user?.gender)}
          alt="Ваш профиль"
          width={40}
          height={40}
          className="w-10 h-10 cursor-pointer object-cover rounded-full"
          onError={handleAvatarError}
          unoptimized
        />
        <p className="hidden xl:block cursor-pointer p-2.5">
          {getDisplayName()}
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
        justify-center bg-white text-main-text text-[15px] rounded transition-all duration-300
        ${isMobile ? "bottom-full mb-1" : "top-full mt-5"}
        ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href="/user-profile"
          className="hover:text-secondary duration-300 px-4 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Профиль
        </Link>
        <Link
          href="/"
          className="hover:text-secondary duration-300 px-4 py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          Главная
        </Link>
        {isManagerOrAdmin && (
          <Link
            href="/admin"
            className="hover:text-secondary duration-300 px-4 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Панель управления
          </Link>
        )}
        <button
          onClick={handleLogout}
          disabled={isLogginOut}
          className="cursor-pointer hover:text-secondary duration-300 px-4 py-2 w-full text-left border-t border-t-gray-200"
        >
          {isLogginOut ? "Выход..." : "Выйти"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
