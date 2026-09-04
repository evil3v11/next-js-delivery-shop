export interface GenerationFormProps {
  topic: string;
  selectedCategoryId: string;
  selectedCategorySlug?: string;
  categorySlug?: string;
  isCategoryOpen: boolean;
  isGenerating: boolean;
  onTopicChange: (value: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onToggleCategoryOpen: () => void;
  onGenerate: () => void;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface CategorySelectProps {
  selectedCategoryId: string;
  isOpen: boolean;
  onCategorySelect: (categoryId: string) => void;
  onToggleOpen: () => void;
}

export interface GenerateArticleButtonProps {
  isGenerating: boolean;
  disabled: boolean;
  onGenerate: () => void;
}

export interface ArticleTopicInputProps {
  topic: string;
  categorySlug?: string;
  selectedCategorySlug?: string;
  onTopicChange: (value: string) => void;
}

export interface ImageGenerationResult {
  mainImageUrl: string;
  middleImageUrl: string;
  endImageUrl: string;
}

export interface ArticleData {
  _id: string;
  name: string;
  content: string;
  image: string;
  imageAlt: string;
  [key: string]: unknown;
}

export interface GenerationStatusPanelProps {
  status: "generating" | "loading" | "success" | "error" | "idle";
  elapsedSeconds: number;
  operationId?: string;
  currentStep?: string;
  totalSteps?: string;
  currentStepName?: string;
}

export type ProgressCallback = (step: number, stepName: string) => void;