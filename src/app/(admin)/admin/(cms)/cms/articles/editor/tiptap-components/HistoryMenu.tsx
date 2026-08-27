"use client";

import { useEditorState } from "@tiptap/react";

import { EditorProps } from "../../_types";

import { Redo, Undo } from "lucide-react";

const HistoryMenu = ({ editor }: EditorProps) => {
  const { canUndo = false, canRedo = false } =
    useEditorState({
      editor,
      selector: (ctx) => ({
        canUndo: ctx.editor?.can().undo() ?? false,
        canRedo: ctx.editor?.can().redo() ?? false,
      }),
    }) ?? {};

  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
        title="Отменить (Ctrl+Z)"
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600 
        disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
        title="Повторить (Ctrl+Y)"
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600 
        disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default HistoryMenu;
