"use client";
import { useEffect, useState } from "react";
import { Badge, Button, Card } from "../ui";
import Image from "next/image";
import { toast } from "sonner";
import { Suspense } from "react";

interface EditImageProps {
  transformations: string;
}

export function EditImage({ transformations }: EditImageProps) {
  const [secureUrl, setSecureUrl] = useState<string>("");

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

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(transformedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg"; // Puedes cambiar el nombre del archivo aquí
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      toast.error("Error al descargar la imagen");
    }
  };

  return (
    <Card className="max-w-4xl">
      <Card.Header>
        <Card.Title>Imagen Editada</Card.Title>
        <Card.Description>Puedes seguir pidiendo cambios</Card.Description>
        <Badge shape="circle">{transformations}</Badge>
      </Card.Header>
      <Card.Content>
        <Suspense fallback={<p>Loading image...</p>}>
          <ImageAsync src={transformedUrl} alt={"Uploaded Image"} />
        </Suspense>
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

const ImageAsync = async ({
  src,
  alt,
  ...props
}: {
  src: string;
  alt: string;
  [key: string]: string;
}) => {
  return <Image width={500} height={500} src={src} alt={alt} {...props} />;
};
