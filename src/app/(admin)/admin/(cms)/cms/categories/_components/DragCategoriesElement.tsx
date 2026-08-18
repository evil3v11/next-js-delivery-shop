"use client";

import { GripVertical } from "lucide-react";

const DragCategoriesElement = () => {
  return (
    <div
      title="Перетащить для сортировки"
      className="flex items-center justify-center cursor-grab active:cursor-grabbing hover:opacity-100 
      transition-opacity p-2 text-gray-400"
    >
      <GripVertical className="w-5 h-5" />
    </div>
  );
};

export default DragCategoriesElement;
