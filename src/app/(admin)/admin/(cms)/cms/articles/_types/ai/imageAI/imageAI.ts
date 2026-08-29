import { ApiResponse } from "@/types/api/default-response";

export type AspectRatio = "1:1" | "16:9" | "16:10" | "21:9";

export type ImageStyle =
  "default" | "realistic" | "artistic" | "sketch" | "cartoon";

export type GenerationStatus =
  "idle" | "generating" | "loading" | "success" | "error" | "failed";

export interface Generation {
  status: GenerationStatus;
  operationId?: string;
  imageUrl?: string;
  error?: string;
}

export interface StyleOption {
  id: ImageStyle;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export type GenerationRequestData = {
  prompt: string;
  aspect_ratio?: AspectRatio;
  style?: ImageStyle;
};

export type YandexArtImageGenerationResponse = ApiResponse & {
  operationId?: string;
  details?: string;
  model?: string;
  done?: boolean;
  imageUrl?: string;
  hasImage?: boolean;
};

export type YandexArtImageGenerationRequestBody = {
  modelUri: string;
  messages: { text: string; weight: number }[];
  generationOptions: {
    mimeType: "image/png";
    seed: number;
    aspectRatio?: {
      widthRatio: number;
      heightRatio: number;
    };
  };
};

export type OperationStatus = {
  done: boolean;
  response?: {
    image: string;
  };
  error?: string;
  createdAt?: string;
  modifiedAt?: string;
};

export type YandexArtPollResponse = ApiResponse & {
  status: GenerationStatus;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  format?: string;
  operationId?: string;
};

export type ImageAIMenuModalProps = {
  prompt: string;
  generation: Generation;
  selectedAspect: AspectRatio;
  selectedStyle: ImageStyle;
  elapsedSeconds: number;
  apiInfo: string;
  onCloseClick: () => void;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAspectChange: (ratio: AspectRatio) => void;
  onStyleChange: (style: ImageStyle) => void;
  onDownload: (e: React.MouseEvent) => void;
  onInsertInEditor: (e: React.MouseEvent) => void;
  onGenerateImage: () => Promise<void>;
  onTestApi: () => Promise<void>;
};

export type MenuHeaderProps = Pick<ImageAIMenuModalProps, "onCloseClick"> & {
  isGenerating: boolean;
  onTestApi: () => void;
};

export type MenuContentProps = Omit<
  ImageAIMenuModalProps,
  "onCloseClick" | "onTestApi"
> & {
  isGenerating: boolean;
};

export type SettingsPanelProps = {
  selectedAspect: AspectRatio;
  selectedStyle: ImageStyle;
  onAspectChange: (ratio: AspectRatio) => void;
  onStyleChange: (style: ImageStyle) => void;
  isGenerating: boolean;
};

export type MenuPromptSectionProps = Pick<
  MenuContentProps,
  "prompt" | "onPromptChange" | "isGenerating"
>;

export type MenuErrorPanelProps = {
  error: string;
};

export type MenuStatusPanelProps = {
  status: GenerationStatus;
  operationId: string;
  elapsedSeconds: number;
};

export type MenuResultPanelProps = {
  imageUrl: string;
  prompt: string;
  selectedStyle: ImageStyle;
  selectedAspect: AspectRatio;
  elapsedSeconds: number;
  onDownload: (e: React.MouseEvent) => void;
  onInsertInEditor: (e: React.MouseEvent) => void;
};

export type MenuFooterProps = {
  generationStatus: GenerationStatus;
  elapsedSeconds: number;
  prompt: string;
  onCloseClick?: (e: React.MouseEvent) => void;
  onInsertInEditor: (e: React.MouseEvent) => void;
  onGenerateImage: (e: React.MouseEvent) => void;
};
