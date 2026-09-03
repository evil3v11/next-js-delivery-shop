"use client";

import { useEffect, useState } from "react";

import { ChevronUp } from "lucide-react";

const ScrollToTopButton = ({ appearPos = 0, finishPos = 0 }) => {
  const [showScrollToTopBtn, setShowScrollToTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollToTopBtn(window.scrollY > appearPos);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [appearPos]);

  const scrollToTop = () => window.scrollTo({ top: finishPos, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      aria-label="Прокрутить вверх"
      className={`fixed left-[50%] bottom-6 z-50 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg 
        hover:bg-green-700 cursor-pointer duration-300 flex items-center justify-center ${
          showScrollToTopBtn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;
