import { useEffect } from "react";

export const useScrollModalToCenter = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  isOpen: boolean,
): void => {
  useEffect(() => {
    if (ref.current && isOpen) {
      ref.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [isOpen, ref]);
};
