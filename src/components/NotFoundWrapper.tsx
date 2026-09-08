"use client";

import dynamic from "next/dynamic";

const NotFoundContent = dynamic(() => import("@/components/NotFoundContent"), {
  ssr: false,
});

const NotFoundWrapper = () => (
  <div className="fixed inset-0 z-50 bg-blue-950 w-full">
    <NotFoundContent />
  </div>
);

export default NotFoundWrapper;
