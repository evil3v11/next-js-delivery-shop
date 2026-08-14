import { OrderStats } from "@/types/order";

const AdminOrdersHeader = ({ stats }: { stats: OrderStats | null; }) => {
  return (
    <div className="mb-6 md:mb-8 xl:mb-10 relative w-fit">
      <h1 className="text-4xl md:text-5xl xl:text-[64px] text-main-text font-bold">
        Заказы
      </h1>
      {stats && (
        <div className="absolute -top-5 left-[calc(100%+8px)] md:left-[calc(100%+12px)] xl:left-[calc(100%+20px)] 
        bg-secondary rounded px-2 py-1 w-9 h-8 flex justify-center items-center text-xs md:text-sm 
        xl:text-base text-white">
          {stats.amountOfNextThreeDaysOfOrders}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersHeader;
