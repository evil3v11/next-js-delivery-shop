interface HtmlEditorModalRedactorProps {
  preRef: React.RefObject<HTMLPreElement | null>;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
  highlightedHtml: string;
  htmlContent: string;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTextAreaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const HtmlEditorModalRedactor = ({
  preRef,
  textAreaRef,
  highlightedHtml,
  htmlContent,
  handleTextAreaChange,
  handleTextAreaKeyDown,
}: HtmlEditorModalRedactorProps) => (
  <div className="border-r border-gray-800 flex flex-col relative">
    <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
      <span className="text-sm font-medium text-gray-300">Редактор HTML</span>
      <span className="text-xs text-gray-400 ml-2">
        (Ctrl+Enter сохранить, Esc отмена)
      </span>
    </div>
    <div className="flex-1 overflow-auto relative">
      <pre
        ref={preRef}
        className="absolute inset-0 m-0 p-4 font-mono text-sm text-gray-100 leading-relaxed pointer-events-none overflow-hidden"
        style={{
          fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
          lineHeight: "1.5",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      <textarea
        ref={textAreaRef}
        value={htmlContent}
        onChange={handleTextAreaChange}
        onKeyDown={handleTextAreaKeyDown}
        className="absolute inset-0 w-full h-full bg-gray-900/10 text-white/0 font-mono text-sm p-4 resize-none outline-none caret-white"
        spellCheck="false"
        placeholder="Введите HTML код..."
        style={{
          fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
          lineHeight: "1.5",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />
    </div>
  </div>
);

export default HtmlEditorModalRedactor;
