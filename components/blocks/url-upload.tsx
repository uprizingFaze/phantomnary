"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/upload";

const cloudName = "dars3e4eo"; // Reemplaza con tu cloud name
const uploadPreset = "nqni9wz9"; // Reemplaza con tu upload preset

async function uploadToCloudinary(file: File) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }
  console.log(response.json);

  return response.json();
}

export function UrlUpload() {
  const [, setFiles] = useState<File[]>([]);
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log(files);

    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const uploadResults = await Promise.all(uploadPromises);
      console.log(uploadResults);
    } catch (error) {
      console.error("Error subiendo archivos:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}