"use client";

import { useEffect, useState } from "react";
import { useDnDStore } from "@/store/dndStore";

import { SortableItemProps } from "../_types";

import DesktopCategoryRow from "./DesktopCategoryRow";
import MobileCategoryCard from "./MobileCategoryCard";

const SortableItem = ({
  id,
  category,
  displayNumericId,
  onDelete,
  onEdit,
}: SortableItemProps) => {
  const [isMobileView, setIsMobileView] = useState(false);
  
  const { draggedId } = useDnDStore();

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isBeingDragged = draggedId === id;

  return (
    <div>
      {isMobileView ? (
        <div>
          <MobileCategoryCard
            category={category}
            displayNumericId={displayNumericId}
            onDelete={onDelete}
            onEdit={onEdit}
            isBeingDragged={isBeingDragged}
          />
        </div>
      ) : (
        <DesktopCategoryRow
          category={category}
          displayNumericId={displayNumericId}
          onDelete={onDelete}
          onEdit={onEdit}
          isBeingDragged={isBeingDragged}
        />
      )}
    </div>
  );
};

export default SortableItem;
