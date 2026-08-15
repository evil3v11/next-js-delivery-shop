"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { menuItems } from "../../_utils/menuItems";

import { Truck } from "lucide-react";
import GlobalStyles from "./GlobalStyles";
import MenuOverlay from "./MenuOverlay";
import MenuHeader from "./MenuHeader";
import MenuItemsList from "./MenuItemsList";
import MenuFooter from "./MenuFooter";

interface SidebarMenuProps {
  isSidebarOpen: boolean;
  onCloseSidebarAction: () => void;
}

const SidebarMenu = ({
  isSidebarOpen,
  onCloseSidebarAction,
}: SidebarMenuProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && isSidebarOpen) onCloseSidebarAction();
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isSidebarOpen, onCloseSidebarAction]);

  const handleItemClick = (path: string): void => {
    router.push(path);
    onCloseSidebarAction();
  };

  return (
    <>
      <GlobalStyles />
      <MenuOverlay
        isSidebarOpen={isSidebarOpen}
        onCloseSidebarAction={onCloseSidebarAction}
      />
      <div
        className={`fixed right-0 top-0 h-full w-96 z-200 shadow-2xl shadow-black/20 ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
        style={{
          transition:
            "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out",
        }}
      >
        <div className="absolute -left-2 top-0 h-full w-2 bg-linear-to-r from-transparent via-blue-500/10 to-transparent blur-sm" />
        <div className="absolute -left-4 top-4 h-[calc(100%-2rem)] w-1 bg-linear-to-r from-transparent via-purple-500/5 to-transparent blur" />
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-linear-to-b from-white via-white to-gray-50/95 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 shadow-[inset_0_0_60px_-20px_rgba(59,130,246,0.1)]" />
          <div className="relative h-full flex flex-col p-8">
            <MenuHeader
              onCloseSidebarAction={onCloseSidebarAction}
              icon={<Truck className="relative w-7 h-7 text-blue-600" />}
            />
            <MenuItemsList items={menuItems} onItemClick={handleItemClick} />
            <MenuFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
