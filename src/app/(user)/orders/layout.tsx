import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Заказы",
    template: "%s | Северяночка",
  },
  description: "Ваши заказы",
};

const OrdersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] mx-auto py-8">
      <h1 className="mb-6 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] text-main-text font-bold">
        Заказы
      </h1>
      {children}
    </div>
  );
};

export default OrdersLayout;
