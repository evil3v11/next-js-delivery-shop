import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) => {
  try {
    const resolvedPaths = await params;
    const filePath = resolvedPaths.path.join("/");
    const fullPath = path.join(process.cwd(), "uploads", filePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "File could not be found" },
        { status: 404 },
      );
    }

    const fileContent = fs.readFileSync(fullPath);
    const extension = path.extname(fullPath).toLowerCase();

    let contentType = "";
    switch (extension) {
      case ".png":
        contentType = "image/png";
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
      case ".webp":
        contentType = "image/webp";
      default:
        contentType = "application/octet-stream";
    }

    return new NextResponse(fileContent, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error(`API error: ${e}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
