import { Editor } from "@tiptap/react";
import type { Node } from "prosemirror-model";
import { CONFIG_TOOLBAR_COMPONENTS } from "../../editor/_utils/CONFIG_TOOLBAR";

export interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export interface CharCounterProps {
  wordCount: number;
  charCount: number;
}

export interface EditorProps {
  editor: Editor | null;
}

export interface HtmlEditorProps extends EditorProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export interface NodeInfo {
  node: Node;
  pos: number;
  type: string;
}

export interface ImageMenuProps extends EditorProps {
  onImageDragOverChange: (bool: boolean) => void;
}

export type UseEditorImageUploadReturn = {
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  insertByUrl: () => void;
  validateImageFile: (file: File) => string | null;
};

export type TempImageUploadResult = {
  url: string;
  filename: string;
  originalName: string;
};

export type ImageAttributesAlign = "left" | "right" | "center" | "none";

export interface ImageAttributesState {
  src: string;
  alt: string;
  title: string;
  width?: string;
  height?: string;
  align?: ImageAttributesAlign;
  style?: string;
}

export interface SelectedImage {
  node: Node;
  pos: number;
  attrs: ImageAttributesState;
}

export type ModalAttributes = Required<
  Omit<ImageAttributesState, "src" | "style">
>;

export interface ImageAttributesModalContentProps {
  currentImage: ImageAttributesState | null;
  attributes: ModalAttributes;
  setAttributes: React.Dispatch<React.SetStateAction<ModalAttributes>>;
  activeTab: "basic" | "advanced";
  setActiveTab: (tab: "basic" | "advanced") => void;
  setPresetSize: (preset: "small" | "medium" | "large" | "original") => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

export type ToolbarGroup = {
  id: string;
  name: string;
  items: string[];
};

export type ToolbarComponentId = keyof typeof CONFIG_TOOLBAR_COMPONENTS