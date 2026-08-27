import { useState, useCallback } from "react";
import {
  handleImageUpload,
  handleImageUrl,
  validateImageFile,
} from "../../_utils/upload-image";
import { UseEditorImageUploadReturn } from "../../_types";

import { Editor } from "@tiptap/react";

export const useEditorImageUpload = (editor: Editor | null): UseEditorImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!editor) return;

      setIsUploading(true);
      try {
        await handleImageUpload(file, editor);
      } finally {
        setIsUploading(false);
      }
    },
    [editor],
  );

  const insertByUrl = useCallback(() => {
    if (!editor) {
      console.error("Editor is not available");
      return;
    }
    handleImageUrl(editor);
  }, [editor]);

  return {
    isUploading,
    uploadFile,
    insertByUrl,
    validateImageFile,
  };
};