"use client";
import { useEffect, useState } from "react";
import { Badge, Button, Card } from "../ui";
import { toast } from "sonner";
import { Compare } from "../ui/compare";

interface EditImageProps {
  transformations: string;
}

export function GenerateCompare({ transformations }: EditImageProps) {
  const [secureUrl, setSecureUrl] = useState<string>("");
  const [, setIsLoading] = useState<boolean>(true);
  const [, setImageKey] = useState<number>(0);

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

  useEffect(() => {
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

    checkImage();
  }, [transformedUrl]);

  return (
    <Card className="max-w-4xl">
      <Card.Header>
        <Card.Title>Escalado</Card.Title>
        <Card.Description>Compara</Card.Description>
        <div>

          <Badge shape="circle" className="inline-block w-auto px-2">
            {transformations}
          </Badge>
        </div>
      </Card.Header>
      <Card.Content>
        <Compare
          firstImage={secureUrl}
          secondImage={transformedUrl}
          firstImageClassName="object-cover object-left-top"
          secondImageClassname="object-cover object-left-top"
          className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
          slideMode="hover"
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
