"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

import Loader from "@/components/Loader";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const AdminPageLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, checkAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };

    verifyAccess();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      const hasAccess =
        user && (user.role === "admin" || user.role === "manager");
      if (!hasAccess) router.replace("/");
    }
  }, [isCheckingAuth, user, router]);

  if (!user || (user.role !== "admin" && user.role !== "manager")) return null;

  if (isLoading || isCheckingAuth) return <Loader />;

  return (
    <>
      {children}
      <ScrollToTopButton appearPos={300} finishPos={600} />
    </>
  );
};

export default AdminPageLayout;
