import { ObjectId } from "mongodb";

export type ChatMessage = {
  _id?: ObjectId;
  orderId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userRole?: string;
};

export type ChatState = {
  messages: ChatMessage[];
  unreadCount: number;
};

export type OrderChatModalProps = {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
};

export type GetChatMessagesResponse =
  | ChatMessage[]
  | {
      success: boolean;
      message: string;
    };

export type HasUnreadChatMessagesResponse =
  | {
      success: boolean;
      message: string;
    }
  | boolean;

export type PostChatMessageResponse = {
  success: boolean;
  message: ChatMessage | string;
};
