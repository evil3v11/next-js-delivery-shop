import { ApiResponse } from "@/types/api/default-response";
import { quickActions } from "../../../editor/_utils/quickAction";

export type AIStatus = "idle" | "loading" | "success" | "error";
export type QuickAction = (typeof quickActions)[number]["id"] | "custom";

export interface TextAIMenuModalProps {
  isGenerating: boolean;
  onClose: () => void;
  aiStatus: AIStatus;
  selectedText: string;
  prompt: string;
  onPromptChange: React.Dispatch<React.SetStateAction<string>>;
  onQuickAction: (actionId: QuickAction) => void;
  errorDetails: string;
  onCustomPropmtAction: () => void;
  onTestAPIAction: () => Promise<void>;
}

export interface PromptInputProps extends Pick<TextAIMenuModalProps, "prompt"> {
  onChange: (prompt: string) => void;
  disabled: boolean;
}

export interface QuickActionsPanelProps {
  onActionClick: (actionId: QuickAction) => void;
  isGenerating: boolean;
}

export interface TextAIMenuFooterProps extends Pick<
  TextAIMenuModalProps,
  "aiStatus" | "selectedText" | "isGenerating" | "errorDetails"
> {
  isSubmitDisabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export interface ConnectionStatusProps {
  onTestAPI: () => void;
  isGenerating: boolean;
}

export interface YandexGPTRequest {
  prompt: string;
  action?: QuickAction;
}

export interface YandexGPTResponse extends ApiResponse {
  data?: {
    text?: string;
    model?: string;
    error?: string;
    details?: string;
  };
  details?: string;
}

export interface YandexGPTApiResponse {
  result?: {
    alternatives?: Array<{
      message?: {
        text?: string;
      };
    }>;
  };
  error?: {
    message?: string;
  };
}

export interface ErrorWithStatusCode extends Error {
  statusCode: number;
}
