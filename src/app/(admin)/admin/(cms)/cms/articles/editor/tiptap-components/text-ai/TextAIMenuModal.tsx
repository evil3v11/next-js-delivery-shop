"use client";

import { TextAIMenuModalProps } from "../../../_types";

import { Brain, X } from "lucide-react";
import TextAIMenuFooter from "./TextAIMenuFooter";
import PromptInput from "./PromptInput";
import QuickActionsPanel from "./QuickActionsPanel";
import ConnectionStatus from "./ConnectionStatus";

const TextAIMenuModal = ({
  isGenerating,
  aiStatus,
  selectedText,
  onClose,
  prompt,
  onPromptChange,
  onQuickAction,
  errorDetails,
  onCustomPropmtAction,
  onTestAPIAction,
}: TextAIMenuModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-linear-to-br from-purple-700 to-pink-700 flex items-center 
    justify-center z-100 p-4 backdrop-blur-sm px-[max(12px,calc((100%-1208px)/2))] cursor-default"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full overflow-hidden select-text"
      >
        <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-red-50 to-yellow-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-red-600 animate-spin" />
              YandexGPT Помощник
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                RU Рабочий режим
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg duration-300 cursor-pointer"
            disabled={isGenerating}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-3 md:p-6 overflow-y-auto max-h-[60vh]">
          <ConnectionStatus
            onTestAPI={onTestAPIAction}
            isGenerating={isGenerating}
          />
          <QuickActionsPanel
            isGenerating={isGenerating}
            onActionClick={onQuickAction}
          />
          <PromptInput
            prompt={prompt}
            onChange={onPromptChange}
            disabled={isGenerating}
          />
        </div>
        <TextAIMenuFooter
          aiStatus={aiStatus}
          selectedText={selectedText}
          onCancel={onClose}
          isGenerating={isGenerating}
          onSubmit={onCustomPropmtAction}
          isSubmitDisabled={!prompt.trim()}
          errorDetails={errorDetails}
        />
      </div>
    </div>
  );
};

export default TextAIMenuModal;
