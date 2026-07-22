"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAvatar } from "@/hooks/useAvatar";

import { getAvatarByGender } from "@/utils/getAvatarByGender";
import { optimizeCameraPhoto } from "@/utils/optimizeImages/optimizeCameraPhoto";
import { optimizeImage } from "@/utils/optimizeImages/optimizeImage";

import Image from "next/image";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import ConfirmAvatarModal from "./ConfirmAvatarModal";
import CameraModal from "./CameraModal";

const ProfileAvatar = ({ gender }: { gender: string }) => {
  const { user } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { displayAvatar, isUploading, uploadAvatar } = useAvatar({
    userId: user?.id,
    gender,
  });

  useEffect(() => {
    if (modalRef.current && showConfirmModal) {
      modalRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [showConfirmModal]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getVideoTracks().forEach((track) => track.stop());
      }

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [cameraStream, previewUrl]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.target as HTMLInputElement;
    target.src = getAvatarByGender(gender);
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedFile = await optimizeImage(file, 128, 0.7);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          const previewUrl = e.target?.result as string;
          setPreviewUrl(previewUrl);
          setPendingFile(optimizedFile);
          setShowConfirmModal(true);
        }
      };

      fileReader.readAsDataURL(optimizedFile);
    } catch (e) {
      console.error("Ошибка оптимизации изображения: ", e);
      alert("Не удалось обработать изображение");
    }
  };

  const handleAvatarConfirm = async () => {
    if (pendingFile) {
      setShowConfirmModal(false);
      try {
        await uploadAvatar(pendingFile);
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl("");
      } catch (e) {
        alert(e instanceof Error ? e.message : "Ошибка загрузки");
        setPreviewUrl("");
      } finally {
        setPendingFile(null);
      }
    }
  };

  const handleCancelUpload = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
    setPreviewUrl("");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startCamera = async () => {
    if (!navigator?.mediaDevices) {
      console.error("navigator.mediaDevices is undefined");
      alert(
        "Доступ к камере недоступен. Убедитесь, что вы используете защищенное соединение (HTTPS) и открыли сайт в полноценном браузере (например, Safari).",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      setCameraStream(stream);
      setShowCameraModal(true);
      setIsCameraReady(false);
    } catch (e) {
      console.error("Ошибка доступа к камере: ", e);
      alert("Не удалось получить доступ к камере");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setIsCameraReady(false);
  };

  const handleVideoLoaded = () => setIsCameraReady(true);

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current && isCameraReady && user?.id) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        alert("Ошибка создания контекста canvas");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const optimizedFile = await optimizeCameraPhoto(
          canvas,
          0.7,
          128,
          user.id,
        );

        const previewUrl = URL.createObjectURL(optimizedFile);

        setPreviewUrl(previewUrl);
        stopCamera();
        setPendingFile(optimizedFile);
        setShowConfirmModal(true);
      } catch (e) {
        alert(`Не удалось сменить аватар: ${e}`);
      }
    } else {
      alert("Камера еще не готова");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="relative">
          <Image
            src={displayAvatar}
            alt="Аватар профиля"
            width={128}
            height={128}
            onError={handleImageError}
            className="h-32 w-32 object-cover border-4 border-white shadow-2xl rounded-full"
            priority
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b2 border-white" />
            </div>
          )}
          <label
            className="bg-primary hover:bg-green-600 h-10 w-10 absolute -bottom-1 right-0 rounded-full 
            flex items-center justify-center text-white cursor-pointer duration-300"
          >
            <IconAvatarChange />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png, image/webp, image/gif, image/avif"
              onChange={handleFileInputChange}
            />
          </label>
          <button
            className="absolute -bottom-1 left-0 bg-secondary text-white p-2 rounded-full cursor-pointer 
            shadow-article hover:bg-[#e5410a] durartion-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
            title="Сделать фото"
            onClick={startCamera}
          >
            <Image
              src="/icons-users/icon-camera.png"
              alt="Фото"
              width={24}
              height={24}
              sizes="24px"
            />
          </button>
        </div>
      </div>
      <ConfirmAvatarModal
        showConfirmModal={showConfirmModal}
        previewUrl={previewUrl}
        isUploading={isUploading}
        confirmAvatarAction={handleAvatarConfirm}
        cancelUploadAction={handleCancelUpload}
        ref={modalRef}
      />
      <CameraModal
        showCameraModal={showCameraModal}
        isCameraReady={isCameraReady}
        isUploading={isUploading}
        videoRef={videoRef}
        canvasRef={canvasRef}
        closeCameraModal={stopCamera}
        onVideoLoaded={handleVideoLoaded}
        onTakePhoto={takePhoto}
      />
      <div className="flex flex-col gap-y-3 items-center mt-10 text-main-text text-center">
        <span>Нажмите на иконки для смены&nbsp;аватара</span>
        <span className="text-sm">Загрузите файл или сделать фото</span>
      </div>
    </div>
  );
};

export default ProfileAvatar;
