"use client";

import Image from "next/image";

interface CameraModalProps {
  showCameraModal: boolean;
  isCameraReady: boolean;
  isUploading: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  closeCameraModal: () => void;
  onVideoLoaded: () => void;
  onTakePhoto: () => void;
}

const CameraModal = ({
  showCameraModal,
  isCameraReady,
  isUploading,
  videoRef,
  canvasRef,
  closeCameraModal,
  onVideoLoaded,
  onTakePhoto,
}: CameraModalProps) => {
  if (!showCameraModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center backdrop-blur-xl z-50">
      <div className="bg-white rounded max-w-sm p-5">
        <h3 className="text-lg font-semibold text-center">
          Сделайте фото
        </h3>
      </div>
      <div className="relative p-5 rounded">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full rounded mb-4 mx-auto"
          onLoadedData={onVideoLoaded}
        />
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-3 w-full text-xs md:text-sm justify-center items-center">
          <button
            disabled={!isCameraReady || isUploading}
            onClick={onTakePhoto}
          >
            <div className="flex gap-x-2 md:gap-x-4 justify-center items-center bg-[#f3f2f1] rounded px-4 py-2">
              <Image
                src="/images/graphics/avatar.png"
                alt="Фото"
                width={24}
                height={24}
                sizes="24px"
              />
              {isCameraReady ? "Снять фото" : "Загрузка"}
            </div>
          </button>
          <button
            onClick={closeCameraModal}
            disabled={isUploading}
            className="bg-[#f3f2f1] px-5 py-3 border-none rounded flex hover:shadow-button-active"
          >
            Отмена
          </button>
        </div>
        {!isCameraReady && (
          <p className="text-xs text-main-text text-center mt-2">
            Камера запускается{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
