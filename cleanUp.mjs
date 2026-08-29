import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const tempDir = path.join(_dirname, "public", "temp");
const now = Date.now();
const threeDays = 3 * 24 * 60 * 60 * 1000;

if (fs.existsSync(tempDir)) {
  const files = fs.readdirSync(tempDir);
  if (!files.length) console.log("No files to delete");

  for (const file of files) {
    const match = file.match(/temp_(\d+)_/);

    if (match && match[1]) {
      const fileTime = parseInt(match[1]);

      if (now - fileTime > threeDays) {
        try {
          fs.unlinkSync(path.join(tempDir, file));
          console.log(`Deleted file ${file}`);
        } catch (e) {
          console.error(`Unable to delete file ${file}, error: ${e}`);
        }
      }
    }
  }
}
