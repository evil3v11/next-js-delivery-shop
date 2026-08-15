export type DashboardCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  actionText: string;
};

export type StatItem = Pick<DashboardCard, "title" | "icon" | "color"> & {
  value: string | number;
};
