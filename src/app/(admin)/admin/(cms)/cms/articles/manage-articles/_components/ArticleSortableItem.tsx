"use client";

import { useEffect, useState } from "react";
import { useDnDStore } from "@/store/dndStore";

import { ArticleSortableItemProps } from "../_types";

import MobileArticleCard from "./MobileArticleCard";
import { DesktopArticleRow } from "./DesktopArticleRow";

const ArticleSortableItem = ({
  id,
  article,
  displayNumericId,
}: ArticleSortableItemProps) => {
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
          <MobileArticleCard
            article={article}
            displayNumericId={displayNumericId}
            isBeingDragged={isBeingDragged}
          />
        </div>
      ) : (
        <DesktopArticleRow
          article={article}
          displayNumericId={displayNumericId}
          isBeingDragged={isBeingDragged}
        />
      )}
    </div>
  );
};

export default ArticleSortableItem;
