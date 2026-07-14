export const optimizeImage = async (
  file: File,
  size: number = 128,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Контекст Canvas не доступен"));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      const aspectRatio = img.width / img.height;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (aspectRatio > 1) {
        sourceWidth = img.height;
        sourceX = (img.width - sourceWidth) / 2;
      } else if (aspectRatio < 1) {
        sourceHeight = img.height;
        sourceY = (img.height - sourceHeight) / 2;
      }

      context.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        size,
        size,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpeg";
            resolve(new File([blob], newName, { type: "image/jpeg" }));
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось загрузить изображение"));
    };

    img.src = url;
  });
};
