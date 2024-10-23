"use client";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Tooltip } from "../ui";
import Image from "next/image";
import { toast } from "sonner";
import { IconReload } from "@tabler/icons-react";
import { Description } from "../ui/field";

interface EditImageProps {
  transformations: string;
}

export function GenerateMain({ transformations }: EditImageProps) {
  const [secureUrl, setSecureUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageKey, setImageKey] = useState<number>(0);

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

  const checkImage = async () => {
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
    setIsLoading(false);
    setImageKey((prevKey) => prevKey + 1); // Forzar actualización de la imagen
  };

  useEffect(() => {
    checkImage();
  }, [transformedUrl]);

  return (
    <Card className="max-w-96 min-w-96">
      <Card.Header>
        <div className="flex flex-row justify-between">
          <Card.Title>Imagen editada</Card.Title>
          <Button
            size="square-petite"
            appearance="outline"
            className="ml-4"
            onPress={checkImage}
          >
            <IconReload size={20} />
          </Button>
        </div>
        <Card.Description>
          Observa tus cambios{" "}
          <Tooltip>
            <Tooltip.Trigger aria-label="Fresh drop alert">
              <Badge intent="warning" shape="circle">Transformations</Badge>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow={false}>
              <Description>{transformations}</Description>
            </Tooltip.Content>
          </Tooltip>
        </Card.Description>
      </Card.Header>
      <Card.Content className="max-h-96 min-h-72 flex justify-center items-center">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span>Cargando...</span>
          </div>
        ) : (
          <Image
            key={imageKey} // Usar imageKey para forzar la actualización
            src={transformedUrl}
            alt="Uploaded Image"
            width={250}
            height={250}
          />
        )}
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
