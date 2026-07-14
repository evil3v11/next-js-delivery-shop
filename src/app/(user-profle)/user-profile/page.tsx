"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import { Mail, MailWarning, Phone } from "lucide-react";

import SecuritySection from "../_components/SecuritySection";
import ErrorContent from "@/app/(auth)/(registration)/_components/ErrorContent";
import Loader from "@/components/Loader";
import UserProfileHeader from "../_components/UserProfileHeader";
import ProfileAvatar from "../_components/ProfileAvatar";

import "../styles.css";

const UserProfilePage = () => {
  const { user, isAuth, checkAuth } = useAuthStore();
  const [isCheckingAuthStatus, setIsCheckingAuthStatus] = useState(true);

  const router = useRouter();

  const registeredByPhone = user?.phoneNumberVerified;

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
      setIsCheckingAuthStatus(false);
    };

    checkAuthentication();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuthStatus && !isAuth) router.replace("/");
  }, [router, isAuth, isCheckingAuthStatus]);

  if (isCheckingAuthStatus) return <Loader />;
  if (!isAuth) return <Loader />;

  if (!user) {
    return (
      <ErrorContent
        error="Данные пользователя не найдены"
        icon={<MailWarning className="h-8 w-8 text-red-600" />}
        primaryAction={{ label: "Войти", onClick: handleToLogin }}
        secondaryAction={{
          label: "Зарегестрироваться",
          onClick: handleToRegister,
        }}
      />
    );
  }

  function handleToLogin() {
    router.replace("/login");
  }
  function handleToRegister() {
    router.replace("/register");
  }

  return (
    <div className="rounded-lg flex flex-col px-[max(12px,calc((100%-1208px)/2))] my-10">
      <div className="shadow-xl rounded-b-lg relative animate-slide-in opacity">
        <UserProfileHeader name={user.name} lastName={user.lastName} />
        <div className="w-full flex flex-col gap-y-10 p-10 bg-white items-center rounded-b-lg">
          <div className="flex gap-x-2 bg-primary text-white rounded-xl py-1 px-3 text-sm ">
            {registeredByPhone ? (
              <>
                <Phone className="w-4 h-4" />
                Зарегестрирован по телефону
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Зарегестрирован по email
              </>
            )}
          </div>
          <ProfileAvatar gender={user.gender} />
          <hr className="w-full" />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
