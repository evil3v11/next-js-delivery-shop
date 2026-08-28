import Editor from "@monaco-editor/react";
import type * as monaco from "monaco-editor";

interface HtmlEditorModalRedactorProps {
  htmlContent: string;
  handleEditorChange: (value: string | undefined) => void;
  handleEditorDidMount: (editorInstance: monaco.editor.IStandaloneCodeEditor) => void;
  handleBeforeMount: (monacoInstance: typeof monaco) => void;
}

const HtmlEditorModalRedactor = ({
  htmlContent,
  handleEditorChange,
  handleEditorDidMount,
  handleBeforeMount,
}: HtmlEditorModalRedactorProps) => (
  <div className="border-r border-gray-800 flex flex-col relative">
    <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
      <span className="text-sm font-medium text-gray-300">Редактор HTML</span>
    </div>
    <div className="flex-1 overflow-auto relative">
      <Editor
        height="100%"
        language="html"
        value={htmlContent}
        theme="dark-theme"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        loading={
          <div className="text-white font-mono text-sm p-4 bg-gray-900 h-full flex items-center justify-center">
            Загрузка редактора...
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  </div>
);

export default HtmlEditorModalRedactor;
