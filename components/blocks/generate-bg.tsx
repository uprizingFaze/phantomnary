"use client";
import { useEffect, useState } from "react";
import { Badge, Button, Card } from "../ui";
import Image from "next/image";
import { toast } from "sonner";

interface EditImageProps {
  transformations: string;
}

export function GenerateBackground({ transformations }: EditImageProps) {
  const [secureUrl, setSecureUrl] = useState<string>("");
  const [, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const url = localStorage.getItem("selectedSecureUrl") || "";
    setSecureUrl(url);
  }, []);

  const getTransformedUrl = (url: string, transformations: string) => {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
    return url;
  };

  const transformedUrl = getTransformedUrl(secureUrl, transformations);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(transformedUrl).then(() => {
      toast.success("URL copiada al portapapeles");
    });
  };

  const fetchImage = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (response.status === 423) {
      throw new Error("423");
    }
    return response.blob();
  };

  const handleDownloadImage = async () => {
    setIsLoading(true);
    let blob: Blob | null = null;
    while (!blob) {
      try {
        blob = await fetchImage(transformedUrl);
      } catch (error) {
        if ((error as Error).message === "423") {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Reintentar después de 2 segundos
        } else {
          console.error("Error al descargar la imagen:", error);
          toast.error("Error al descargar la imagen");
          setIsLoading(false);
          return;
        }
      }
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg"; // Puedes cambiar el nombre del archivo aquí
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setIsLoading(false);
  };

  return (
    <Card className="max-w-4xl">
      <Card.Header>
        <Card.Title>Editando fondo</Card.Title>
        <Card.Description>Puedes seguir pidiendo cambios</Card.Description>
        <Badge shape="circle">{transformations}</Badge>
      </Card.Header>
      <Card.Content>
        <Image
          src={transformedUrl}
          alt="Uploaded Image"
          width={500}
          height={500}
        />
      </Card.Content>
      <Card.Footer className="flex justify-between">
        <Button appearance={"outline"} onPress={handleCopyUrl}>
          Copiar URL
        </Button>
        <Button className="ml-4" onPress={handleDownloadImage}>
          Descargar Imagen
        </Button>
      </Card.Footer>
    </Card>
  );
}
