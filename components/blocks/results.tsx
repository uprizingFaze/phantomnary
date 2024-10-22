"use client";

import { Card, Table } from "@/components/ui";
import { useEffect, useState } from "react";

export default function ShowTableImage() {
  interface UploadResult {
    id: string;
    created_at: string;
    secure_url: string;
  }

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

  return (
    <Card className="max-w-4xl">
      <Card.Header>
        <Card.Title>Imagenes</Card.Title>
        <Card.Description>Maneja tus imagenes suidas.</Card.Description>
      </Card.Header>
      <Table aria-label="Upload Results">
        <Table.Header>
          <Table.Column isRowHeader>#</Table.Column>
          <Table.Column>Fecha de creación</Table.Column>
          <Table.Column>URL</Table.Column>
        </Table.Header>
        <Table.Body>
          {uploadResults.map((result) => (
            <Table.Row key={result.id}>
              <Table.Cell>{result.id}</Table.Cell>
              <Table.Cell>{formatDate(result.created_at)}</Table.Cell>
              <Table.Cell>{result.secure_url}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
