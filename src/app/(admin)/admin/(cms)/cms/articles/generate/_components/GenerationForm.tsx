import { GenerationFormProps } from "../_types";

import ArticleTopicInput from "./ArticleTopicInput";
import CategorySelect from "./CategorySelect";
import GenerateArticleButton from "./GenerateArticleButton";

const GenerationForm = ({
  topic,
  categorySlug,
  isCategoryOpen,
  isGenerating,
  selectedCategorySlug,
  selectedCategoryId,
  onTopicChange,
  onCategorySelect,
  onGenerate,
  onToggleCategoryOpen,
}: GenerationFormProps) => {
  const isDisabled = isGenerating || !topic.trim() || !selectedCategoryId;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Параметры статьи
      </h2>
      <div className="space-y-6">
        <ArticleTopicInput
          topic={topic}
          categorySlug={categorySlug}
          selectedCategorySlug={selectedCategorySlug}
          onTopicChange={onTopicChange}
        />
        <CategorySelect
          selectedCategoryId={selectedCategoryId}
          isOpen={isCategoryOpen}
          onCategorySelect={onCategorySelect}
          onToggleOpen={onToggleCategoryOpen}
        />
        <GenerateArticleButton
          isGenerating={isGenerating}
          disabled={isDisabled}
          onGenerate={onGenerate}
        />
      </div>
    </div>
  );
};

export default GenerationForm;
