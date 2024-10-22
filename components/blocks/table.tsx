"use client";
import { useState, useEffect } from "react";
import { Card, Table, Button, Modal } from "@/components/ui";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

interface UploadResult {
  id: string;
  created_at: string;
  secure_url: string;
}

const ShowTableImage: React.FC = () => {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

  useEffect(() => {
    const storedResults = JSON.parse(
      localStorage.getItem("uploadResults") || "[]"
    );
    setUploadResults(storedResults);
  }, []);

  if (uploadResults.length === 0) {
    return <div>No haz subido imagenes</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const handleEditClick = (url: string) => {
    localStorage.setItem("selectedSecureUrl", url);
  };

  return (
    <Card className="max-w-3xl">
      <Card.Header>
        <Card.Title>Imagenes</Card.Title>
        <Card.Description>Maneja tus imagenes subidas.</Card.Description>
      </Card.Header>
      <Table aria-label="Upload Results">
        <Table.Header>
          <Table.Column isRowHeader>#</Table.Column>
          <Table.Column>Fecha de creación</Table.Column>
          <Table.Column>URL</Table.Column>
          <Table.Column>Acción</Table.Column>
        </Table.Header>
        <Table.Body>
          {uploadResults.map((result) => (
            <Table.Row key={result.id}>
              <Table.Cell>{result.id}</Table.Cell>
              <Table.Cell>{formatDate(result.created_at)}</Table.Cell>
              <Table.Cell>
                <Link
                  href={result.secure_url}
                  className="hover:text-blue-500 hover:underline"
                >
                  {result.secure_url.length > 30
                    ? `${result.secure_url.substring(0, 30)}...`
                    : result.secure_url}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Modal>
                  <Button size="square-petite" appearance="outline">
                    Ver
                  </Button>
                  <Modal.Content>
                    <Modal.Header>
                      <Modal.Title>Tu imagen</Modal.Title>
                      <Modal.Description>uwu</Modal.Description>
                    </Modal.Header>
                    <Modal.Body>
                      <Image
                        src={result.secure_url}
                        alt="Uploaded Image"
                        width={500}
                        height={500}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Modal.Close>Cancel</Modal.Close>
                      <Button
                        onPress={() => {
                          handleEditClick(result.secure_url);
                          toast.success("Imagen seleccionada para editar");
                        }}
                      >
                        Editar
                      </Button>
                    </Modal.Footer>
                  </Modal.Content>
                </Modal>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

export default ShowTableImage;
