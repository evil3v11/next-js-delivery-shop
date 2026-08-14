"use client";

import { useEffect, useRef, useState } from "react";
import { useGetOrderMessagesQuery } from "@/store/redux/api/chatApi";
import { useAuthStore } from "@/store/authStore";

import { getRoleDisplayName } from "../_utils/getRoleDisplayName";

import { ChatMessage } from "@/types/chat";

import Image from "next/image";
import Loader from "@/components/Loader";

interface OrderChatModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderChatModal = ({ orderId, isOpen, onClose }: OrderChatModalProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const { data: messages = [], isLoading } = useGetOrderMessagesQuery(orderId, {
    skip: !isOpen || !orderId,
    pollingInterval: isOpen ? 3000 : 0,
  });
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMessageRole = (message: ChatMessage) => message.userRole || "courier";

  const handleSendMessage = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderId,
          message: message.trim(),
          userName: user?.name,
          userRole: user?.role,
        }),
      });

      if (!response.ok) throw new Error(`Произошла ошибка: ${response.status}`);
      setMessage("");
    } catch (e) {
      console.error("Ошибка при отправке сообщения: ", e)
    } finally {
      setIsSending(false)
    }
  };

  if (isLoading) return <Loader />

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-main-text py-10 px-3">
      <div className="max-w-150 w-full relative bg-white rounded shadow-auth-form max-h-[calc(100vh-80px)] flex flex-col px-25 pb-15">
        <button
          onClick={onClose}
          className="bg-[#f3f2f1] rounded w-10 h-10 mb-8 absolute top-0 right-0 flex justify-center items-center duration-300 cursor-pointer"
        >
          <Image
            src="/icons-auth/icon-form-close.svg"
            alt="Закрыть"
            width={24}
            height={24}
          />
        </button>
        <h3 className="text-center text-2xl font-bold px-4 mt-18 mb-8">
          Комментарии
        </h3>
        <div className="flex-1 overflow-y-auto space-y-8 w-full mx-auto pr-5">
          {messages.map((msg) => {
            const role = getMessageRole(msg);
            const roleDisplayName = getRoleDisplayName(role);

            return (
              <div key={String(msg._id)} className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap text-[#8f8f8f]">
                  <div>{msg.userName}</div>
                  <div>{roleDisplayName}</div>
                  <div>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {new Date(msg.timestamp).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="border border-[#bfbfbf] rounded px-2 py-1">
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="w-full mx-auto">
          <div className="flex flex-col gap-8">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 border border-[#bfbfbf] rounded px-2 py-1 h-25.5 focus:outline-none 
              focus:border-primary focus:shadow-button-default caret-primary resize-none"
              disabled={isSending}
              rows={4}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="bg-[#fcd5ba] text-secondary text-2xl px-4 py-2 h-17 rounded hover:bg-secondary 
              hover:text-white disabled:cursor-not-allowed cursor-pointer duration-300"
            >
              {isSending ? "..." : "Отправить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderChatModal;
