import { CharCounterProps } from "../../_types/tiptap";

const CharCounter = ({ wordCount, charCount }: CharCounterProps) => {
  return (
    <div className="mt-2 text-sm text-gray-500 text-right">
      Слов: {wordCount} | Символов: {charCount}
    </div>
  );
};

export default CharCounter;
