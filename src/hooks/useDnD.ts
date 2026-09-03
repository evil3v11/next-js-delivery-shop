import { useCallback, useOptimistic, useTransition } from "react";
import { useDnDStore } from "@/store/dndStore";
import { ObjectId } from "mongodb";

type DnDItem = {
  _id: ObjectId | string;
  numericId: number;
};

export const useDnD = <T extends DnDItem>({
  items,
  setItems,
  onOrderChange,
}: {
  items: T[];
  setItems: (items: T[]) => void;
  onOrderChange?: (reorderedItems: T[]) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const {
    draggedId,
    setDraggedId,
    setDraggedOverId,
    setTempOrder,
    resetDnDStore,
  } = useDnDStore();

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items,
    (
      currentItems,
      { draggedId, droppedId }: { draggedId: string; droppedId: string },
    ): T[] => {
      const draggedItem = currentItems.find((a) => String(a._id) === draggedId);
      const droppedItem = currentItems.find((a) => String(a._id) === droppedId);

      if (!draggedItem || !droppedItem) return currentItems;

      return currentItems
        .map((i) => {
          if (String(i._id) === draggedId) return { ...i, numericId: draggedItem.numericId };
          if (String(i._id) === droppedId) return { ...i, numericId: droppedItem.numericId };
          return i;
        })
        .sort((a, b) => a.numericId - b.numericId);
    },
  );

  const handleDragStart = useCallback((id: string) => setDraggedId(id), [setDraggedId]);
  const handleDragEnd = useCallback(() => setDraggedId(null), [setDraggedId]);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && id !== draggedId) setDraggedOverId(id);
  }, [draggedId, setDraggedOverId]);

  const handleDrop = useCallback((e: React.DragEvent, droppedId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== droppedId) {
      startTransition(() => setOptimisticItems({ draggedId, droppedId }));

      try {
        const newIndex = items.findIndex((i) => String(i._id) === draggedId);
        const oldIndex = items.findIndex((i) => String(i._id) === droppedId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = [...items];
          const [movedItem] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, movedItem);

          const newTempOrder = new Map();
          for (let i = 0; i < newItems.length; i++) {
            newTempOrder.set(String(newItems[i]._id), i + 1);
          }

          setTempOrder(newTempOrder);
          setItems(newItems);

          if (onOrderChange) {
            const reorderedItems = newItems.map((item, i) => ({
              ...item,
              numericId: i + 1,
            }));
            onOrderChange(reorderedItems);
          }

          resetDnDStore();
        }
      } catch (e) {
        console.error("Ошибка Drag'n'Drop: ", e);
      }
    }
  }, [draggedId, items, onOrderChange, resetDnDStore, setItems, setOptimisticItems, setTempOrder]);

  return {
    optimisticItems,
    isPending,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
