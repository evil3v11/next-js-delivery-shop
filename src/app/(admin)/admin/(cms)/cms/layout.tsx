"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";
import SidebarMenu from "./_components/Sidebar/SidebarMenu";

const CMSLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isCMSroot = pathname === "/admin/cms";

  return (
    <>
      {!isCMSroot && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-17 right-6 z-100 p-3 bg-primary text-white rounded-full shadow-lg 
          hover:bg-primary/90 duration-300 cursor-pointer"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <main className="min-h-screen px-[max(12px,calc((100%-1208px)/2))] bg-gray-50 p-6 w-full mx-auto">
        {children}
      </main>
      <SidebarMenu
        isSidebarOpen={isSidebarOpen}
        onCloseSidebarAction={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default CMSLayout;
