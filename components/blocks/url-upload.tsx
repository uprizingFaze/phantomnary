"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/upload";
import { Card } from "../ui";
import { toast } from "sonner";

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

  return response.json();
}

export function UrlUpload() {
  const [, setFiles] = useState<File[]>([]);
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);

    try {
      const uploadPromises = files.map((file) => uploadToCloudinary(file));
      const uploadResults = await Promise.all(uploadPromises);
      toast.success("Imagen subida exitosamente");

      // Recuperar los datos existentes del local storage
      const existingData = JSON.parse(
        localStorage.getItem("uploadResults") || "[]"
      );

      // Extraer created_at, secure_url y generar un ID incremental
      const newUploadData = uploadResults.map((result, index) => ({
        id: existingData.length + index,
        created_at: result.created_at,
        secure_url: result.secure_url,
      }));

      // Añadir los nuevos datos a los existentes
      const updatedData = [...existingData, ...newUploadData];

      // Guardar el conjunto actualizado de datos de vuelta en el local storage
      localStorage.setItem("uploadResults", JSON.stringify(updatedData));
      console.log("Archivos subidos:", updatedData);
    } catch (error) {
      console.error("Error subiendo archivos:", error);
      toast.error("Error subiendo archivos");
    }
  };

  return (
    <Card className="max-w-2xl">
      <FileUpload onChange={handleFileUpload} />
    </Card>
  );
}
