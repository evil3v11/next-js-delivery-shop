"use client";

import { Activity, useEffect, useState } from "react";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";
import {
  useGetOrderMessagesQuery,
  useHasUnreadMessagesQuery,
} from "@/store/redux/api/chatApi";

import { updateOrderStatus } from "@/app/(cart)/cart/_utils/orderHelperFunctions";
import { getMappedStatus } from "../_utils/getMappedStatus";
import { formatPhoneNumber } from "../_utils/formatPhoneNumber";
import { getEnglishStatuses } from "../_utils/getEnglishStatuses";
import { exportOrderToExcel } from "../_utils/exportOrderToExcel";

import type { OrderStatus, PaymentStatus } from "@/types/order";

import { buttonStyles } from "@/app/styles";

import Image from "next/image";
import UserAvatar from "./UserAvatar";
import IconVision from "@/components/svg/IconVision";
import StatusDropdown from "./StatusDropdown";
import IconNotice from "@/components/svg/IconNotice";
import OrderChatModal from "./OrderChatModal";
import CalendarOrderModal from "./CalendarOrderModal";
import OrderProductsLoader from "./OrderProductsLoader";
import OrderDetails from "./OrderDetails";

const AdminOrderCard = ({ orderId }: { orderId: string }) => {
  const { data } = useGetAdminOrdersQuery();
  const order = data?.orders.find((o) => String(o._id) === orderId);

  const [currentStatusLabel, setCurrentStatusLabel] = useState(order ? getMappedStatus(order) : "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showFullOrder, setShowFullOrder] = useState<boolean>(false);
  const [totalOrderWeight, setTotalOrderWeight] = useState(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const { data: messages = [] } = useGetOrderMessagesQuery(orderId);
  const { data: hasUnreadMessages = false } = useHasUnreadMessagesQuery(
    orderId,
    { pollingInterval: showChat ? 1000 : 5000 },
  );

  const showCalendarIcon = order && (order.status === "confirmed" || order.status === "pending");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (order) setCurrentStatusLabel(getMappedStatus(order));
  }, [order]);

  const handleStatusChange = async (newStatusLabel: string): Promise<void> => {
    if (!order) return;

    try {
      setIsUpdating(true);

      const { status: englishStatus, paymentStatus } = getEnglishStatuses(newStatusLabel, order);
      const updateData: { status: OrderStatus; paymentStatus?: PaymentStatus } =
        {
          status: englishStatus,
        };

      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      await updateOrderStatus(String(orderId), updateData);
      setCurrentStatusLabel(newStatusLabel);
    } catch (e) {
      console.error("Ошибка при обновлении статуса: ", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleDetails = (): void => {
    if (!showOrderDetails) {
      setShowOrderDetails(true);
      setShowFullOrder(false);
    } else {
      setShowOrderDetails(false);
      setShowFullOrder(false);
    }
  };

  const handleToggleFullOrder = (): void => {
    if (showFullOrder) {
      setShowOrderDetails(false);
      setShowFullOrder(false);
    } else setShowFullOrder(true);
  };

  const handleOpenChat = (): void => {
    fetch(`/api/admin/chat/${orderId}/read`, { method: "POST" });
    setShowChat(true);
  };

  const handleCloseChat = (): void => setShowChat(false);

  const handleOpenCalendarModal = (): void => showCalendarIcon ? setShowCalendar(true) : undefined;
  const handleCloseCalendarModal = (): void => showCalendarIcon ? setShowCalendar(false) : undefined;
  const handleTotalWeightCalculated = (weight: number): void => setTotalOrderWeight(weight);

  const handleExportToExcel = async (): Promise<void> => {
    if (!order || isExporting) return
    try {
      setIsExporting(true)
      await exportOrderToExcel(order)
    } catch (e) {
      console.error("Ошибка при выгрузке заказа в Excel: ", e)
    } finally {
      setIsExporting(false)
    }
  };

  if (!order) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-wrap justify-between items-start text-main-text gap-x-20">
        <div className="flex gap-x-4 items-center">
          <h2 className="text-base md:text-lg xl:text-2xl font-bold">
            {order.orderNumber.slice(-3)}
          </h2>
          <div className="flex items-center gap-x-2">
            <UserAvatar
              userId={String(order.userId)}
              gender={order.gender}
              name={order.name}
            />
            <span className="text-base md:text-lg">{order.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-2">
            <Image
              alt="Телефон"
              src="/icons-orders/icon-phone.svg"
              width={24}
              height={24}
            />
            <span className="underline">{formatPhoneNumber(order.phone)}</span>
          </div>
          <StatusDropdown
            currentStatusLabel={currentStatusLabel}
            isUpdating={isUpdating}
            onStatusChange={handleStatusChange}
          />
          {showOrderDetails ? (
            <button
              onClick={handleExportToExcel}
              className={`${buttonStyles.active} hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center 
              items-center gap-2 rounded duration-300 cursor-pointer`}
            >
              <Image
                src="/icons-orders/icon-upload.svg"
                alt="Excel"
                width={24}
                height={24}
              />
              Выгрузить в Excel
            </button>
          ) : (
            <button
              onClick={handleToggleDetails}
              className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center 
              items-center gap-2 rounded duration-300 cursor-pointer"
            >
              <IconVision showPassword={!showOrderDetails} />
              Просмотреть
            </button>
          )}
          {showCalendarIcon ? (
            <div className="relative">
              <button
                onClick={handleOpenCalendarModal}
                className="relative bg-[#f3f2f1] hover:shadow-button-secondary w-10 h-10 px-2 flex justify-center 
              items-center gap-2 rounded duration-300 cursor-pointer"
              >
                <Image
                  src="/icons-auth/icon-date.svg"
                  alt="Календарь"
                  width={24}
                  height={24}
                  sizes="24px"
                />
              </button>
              <Activity mode={showCalendar ? "visible" : "hidden"}>
                <CalendarOrderModal
                  orderId={orderId}
                  isOpen={showCalendar}
                  onClose={handleCloseCalendarModal}
                />
              </Activity>
            </div>
          ) : (
            <button
              className="relative bg-[#f3f2f1] hover:shadow-button-secondary w-10 h-10 px-2 flex justify-center 
              items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleOpenChat}
            >
              {!messages.length ? (
                <Image
                  src="/icons-orders/icon-message-empty.svg"
                  alt="Чат пустой"
                  width={24}
                  height={24}
                  sizes="24px"
                />
              ) : (
                <Image
                  src="/icons-orders/icon-message.svg"
                  alt="Чат"
                  width={24}
                  height={24}
                  sizes="24px"
                />
              )}
              {hasUnreadMessages && <IconNotice />}
            </button>
          )}
        </div>
      </div>
      {showOrderDetails && (
        <>
          <OrderProductsLoader
            orderItems={order.items}
            onTotalWeightCalculated={handleTotalWeightCalculated}
            applyIndexStyle={!showFullOrder}
            showFullOrder={showFullOrder}
          />
          {showFullOrder && (
            <OrderDetails order={order} totalWeight={totalOrderWeight} />
          )}
        </>
      )}
      {showOrderDetails && !showFullOrder && (
        <div className="flex justify-center mt-10">
          <button
            className="bg-[#f3f2f1] hover:shadow-button-secondary text-main-text w-60 h-10 px-2 flex 
            justify-center items-center gap-2 rounded duration-300 cursor-pointer"
            onClick={handleToggleFullOrder}
          >
            <IconVision showPassword={true} />
            Показать заказ
          </button>
        </div>
      )}
      {showFullOrder && (
        <div className="flex justify-center mt-10">
          <button
            className="bg-[#f3f2f1] hover:shadow-button-secondary text-main-text w-60 h-10 px-2 flex 
            justify-center items-center gap-2 rounded duration-300 cursor-pointer"
            onClick={handleToggleFullOrder}
          >
            <IconVision showPassword={false} />
            Скрыть
          </button>
        </div>
      )}
      <Activity mode={showChat ? "visible" : "hidden"}>
        <OrderChatModal
          orderId={orderId}
          isOpen={showChat}
          onClose={handleCloseChat}
        />
      </Activity>
    </div>
  );
};

export default AdminOrderCard;
