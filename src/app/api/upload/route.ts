import { mediaWorker } from "@/workers/media-worker";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy tệp tải lên" }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type;
    const ext = path.extname(fileName).toLowerCase();

    // Phân loại ảnh hay video (hỗ trợ cả định dạng đặc thù của iPhone: .heic, .mov)
    const isImage =
      fileType.startsWith("image/") || [".heic", ".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    const isVideo =
      fileType.startsWith("video/") || [".mov", ".mp4", ".quicktime"].includes(ext);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh hoặc video." },
        { status: 400 }
      );
    }

    // Kiểm tra giới hạn dung lượng video (tối đa 60MB theo BRD)
    if (isVideo && file.size > 60 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dung lượng video vượt quá 60MB. Vui lòng chọn đoạn video ngắn hơn 45 giây." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const savedFileName = `${uniqueId}${ext}`;
    const destinationPath = path.join(uploadDir, savedFileName);

    // Lưu file vào đĩa
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(destinationPath, Buffer.from(arrayBuffer));

    const mediaType = isImage ? "IMAGE" : "VIDEO";
    const initialUrl = `/uploads/${savedFileName}`;

    // Đưa vào hàng đợi xử lý ngầm (Worker nén WebP xoay EXIF hoặc nén MP4 720p)
    mediaWorker.enqueue({
      mediaId: uniqueId,
      originalFilePath: destinationPath,
      originalFileName: savedFileName,
      mimeType: fileType,
      mediaType,
    });

    return NextResponse.json({
      success: true,
      data: {
        file_url: initialUrl,
        media_type: mediaType,
        thumbnail_url: isVideo ? initialUrl : null,
        process_status: isImage && ext !== ".heic" ? "READY" : "PROCESSING",
      },
    });
  } catch (error: any) {
    console.error("Lỗi tải tệp lên:", error);
    return NextResponse.json(
      { error: error.message || "Tải tệp lên thất bại" },
      { status: 500 }
    );
  }
}

