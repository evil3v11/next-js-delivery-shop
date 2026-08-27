import path from "path";
import fs from "fs/promises";

export const processArticleImages = async (
  content: string,
): Promise<string> => {
  const tempImages =
    content.match(/\/temp\/temp_[^"']+\.(jpg|jpeg|png|webp|avif)/gi) || [];
  if (!tempImages.length) return content;

  const tempDir = path.join(process.cwd(), "public", "temp");
  const articlesDir = path.join(process.cwd(), "public", "uploads", "articles");
  await fs.mkdir(articlesDir, { recursive: true });

  const uniqueTempFiles = Array.from(
    new Set(tempImages.map((url) => url.split("/").pop()!)),
  );

  for (const tempFilename of uniqueTempFiles) {
    const oldPath = path.join(tempDir, tempFilename);

    try {
      const originalName = tempFilename.replace("temp_", "");
      const fileExtension = path.extname(originalName);
      const baseName = path.parse(originalName).name;

      const shortBaseName =
        baseName.length > 20 ? baseName.substring(0, 20) : baseName;
      const suffix = Math.random().toString(36).substring(2, 6);

      const permanentFilename = `${shortBaseName}_${suffix}${fileExtension}`;
      const newFilePath = path.join(articlesDir, permanentFilename);
      await fs.copyFile(oldPath, newFilePath);
      await fs.unlink(oldPath);

      const tempUrlPattern = `/temp/${tempFilename}`;
      const permanentUrl = `/uploads/articles/${permanentFilename}`;
      content = content.replace(new RegExp(tempUrlPattern, "gi"), permanentUrl);
    } catch (e) {
      console.error(`Ошибка с факлом ${tempFilename}: `, e);
    }
  }

  return content;
};
