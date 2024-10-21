"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/upload";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log("File uploaded successfully:", data.result);
      } else {
        console.error("File upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
