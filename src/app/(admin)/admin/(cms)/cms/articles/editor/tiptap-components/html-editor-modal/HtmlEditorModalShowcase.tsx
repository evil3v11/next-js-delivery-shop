interface HtmlEditorModalShowcase {
  previewRef: React.RefObject<HTMLDivElement | null>;
  htmlContent: string;
}

const HtmlEditorModalShowcase = ({
  previewRef,
  htmlContent,
}: HtmlEditorModalShowcase) => {
  return (
    <div className="flex flex-col min-h-26">
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-medium text-gray-300">
          Предпросмотр HTML
        </span>
      </div>
      <div className="flex-1 overflow-auto bg-white p-4 " ref={previewRef}>
        <div
          className="html-preview "
          dangerouslySetInnerHTML={{
            __html:
              htmlContent ||
              '<div class="html-preview-empty">Введите HTML для предпросмотра...</div>',
          }}
        />
      </div>
    </div>
  );
};

export default HtmlEditorModalShowcase;
