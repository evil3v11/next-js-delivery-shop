export const optimizeCameraPhoto = (
  canvas: HTMLCanvasElement,
  quality: number = 0.8,
  maxSize: number = 128,
  userId: string,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const tempCanvas = document.createElement("canvas");
    const context = tempCanvas.getContext("2d");

    if (!context) {
      reject(new Error("Контекст Canvas не доступен"));
      return;
    }

    let width = canvas.width;
    let height = canvas.height;

    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    tempCanvas.width = width;
    tempCanvas.height = height;

    context.imageSmoothingQuality = "high";
    context.drawImage(canvas, 0, 0, width, height);

    tempCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(new File([blob], `avatar-${userId}-${Date.now()}.jpg`, { type: "image/jpeg" }));
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/jpeg",
      quality,
    );
  });
};
