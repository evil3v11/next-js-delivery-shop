'use client'

import { transliterateText } from "@/utils/transliterateText";

import { ArticleTopicInputProps } from "../_types";

const ArticleTopicInput = ({
  topic,
  categorySlug,
  selectedCategorySlug,
  onTopicChange,
}: ArticleTopicInputProps) => {
  const currentCategorySlug = selectedCategorySlug || categorySlug || "[category]";
  const slug = transliterateText(topic, true);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Тема/Заголовок статьи *
      </label>
      <input
        type="text"
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="Название статьи"
        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 
        focus:ring-primary/50 focus:border-primary duration-300"
      />
      {topic && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Будет использовано как заголовок статьи</p>
          <p>
            URL: /blog/{currentCategorySlug}/{slug}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticleTopicInput;
