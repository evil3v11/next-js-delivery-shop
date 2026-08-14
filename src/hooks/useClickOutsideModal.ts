import { useEffect, useRef } from "react";

export const useClickOutsideModal = <T extends HTMLElement>(
  onClickOutside: () => void,
): React.RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (!ref.current?.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClickOutside]);

  return ref;
};
