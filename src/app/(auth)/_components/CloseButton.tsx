"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";

const CloseButton = () => {
  const router = useRouter();
  const handleClose = () => router.replace("/");
  return (
    <button
      onClick={handleClose}
      aria-label="Закрыть"
      className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8 absolute top-0 right-0"
    >
      <Image
        src="/icons-auth/icon-form-close.svg"
        alt="Закрыть форму"
        width={24}
        height={24}
        sizes="24px"
      />
    </button>
  );
};

export default CloseButton;
