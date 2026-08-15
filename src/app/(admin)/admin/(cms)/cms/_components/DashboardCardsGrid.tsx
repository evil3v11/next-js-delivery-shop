"use client";

import { useRouter } from "next/navigation";

import { dashboardCards } from "../_utils/dashboardCards";

import DashboardCard from "./DashboardCard";

const DashboardCardsGrid = () => {
  const router = useRouter();
  const navigateTo = (path: string) => router.push(path);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {dashboardCards.map((card) => (
        <DashboardCard key={card.id} card={card} navigateTo={navigateTo} />
      ))}
    </div>
  );
};

export default DashboardCardsGrid;
