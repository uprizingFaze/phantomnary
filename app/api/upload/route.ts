import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as Blob;
  const upload_preset = formData.get("upload_preset") as string;

  if (!file || !upload_preset) {
    return NextResponse.json({ success: false, error: "Missing file or upload_preset" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await cloudinary.uploader.upload_stream(
      { upload_preset, resource_type: "image" },
      (error, result) => {
        if (error) {
          throw error;
        }
        return result;
      }
    ).end(buffer);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
};