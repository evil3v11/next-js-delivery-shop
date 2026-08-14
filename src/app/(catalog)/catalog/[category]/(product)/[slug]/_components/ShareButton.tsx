"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import {
  TelegramIcon,
  TelegramShareButton,
  VKIcon,
  VKShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

interface ShareButtonProps {
  title: string;
  className?: string;
}

const ShareButton = ({ title, className = "" }: ShareButtonProps) => {
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUrl(window.location.href);
  }, []);

  const handleToggleShareMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleToggleShareMenu}
        className="flex flex-wrap gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
      >
        <Image
          src="/icons-products/icon-share.svg"
          alt="Поделиться"
          width={24}
          height={24}
          sizes="24px"
        />
        <p className="text-sm select-none">Поделиться</p>
      </div>
      {showShareMenu && currentUrl && (
        <>
          <div className="fixed inset-0 z-50" onClick={handleClickOutside} />
          <div className="absolute top-full left-0 bg-white shadow-lg rounded-md p-3 z-50 mt-2">
            <div className="flex gap-3">
              <TelegramShareButton
                url={currentUrl}
                title={title}
                className="hover:opacity-70 transition-opacity"
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <VKShareButton
                url={currentUrl}
                title={title}
                className="hover:opacity-70 transition-opacity"
              >
                <VKIcon size={32} round />
              </VKShareButton>
              <WhatsappShareButton
                url={currentUrl}
                title={title}
                className="hover:opacity-70 transition-opacity"
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
