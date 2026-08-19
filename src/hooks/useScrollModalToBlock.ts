import { useEffect } from "react";

export const useScrollModalToBlock = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  isOpen: boolean,
  block: ScrollLogicalPosition,
): void => {
  useEffect(() => {
    if (ref?.current && isOpen) {
      ref.current.scrollIntoView({
        block: block,
        behavior: "smooth",
      });
    }
  }, [isOpen, ref, block]);
};
