"use client";
import { ThemeSwitcher } from "./theme-toggle";
import { Badge, Button, Popover } from "@/components/ui";
import { IconBrandGithub } from "justd-icons";
import { GridList } from "./ui/grid-list";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Navbar() {
  const [, setSelectedItem] = useState<string | null>(null);

  const handleSelection = (item: { id: string; name: string }) => {
    setSelectedItem(item.name);
    navigator.clipboard.writeText(item.name).then(() => {
      toast(`Prompt ${item.name} Copiado!`);
    });
  };

  return (
    <section className="m-4">
      <nav className="w-3/4 mx-auto flex justify-between items-center p-3 bg-overlay border text-white rounded-lg shadow-lg sticky top-0">
        <div className="text-lg dark:text-white text-black font-bold">
          Phantomnary
        </div>
        <ul className="flex space-x-4 items-center justify-center">
          <li className="flex items-center justify-center">
            <Popover>
              <Button intent="secondary">Prompts</Button>
              <Popover.Content showArrow={true} className="min-w-72">
                <div className="flex flex-row justify-between ">
                  <h2 className="my-1 text-lg">Prompts</h2>
                  <Badge className="max-h-5" shape="circle" intent="warning">
                    Selecciona
                  </Badge>
                </div>
                <p className="mb-2 text-muted-fg">Iniciar. Es importante enviar estos 2 mensajes.</p>
                <GridList
                  selectionMode="single"
                  items={principal}
                  aria-label="Select your favorite bands"
                  onSelectionChange={(selectedKeys) => {
                    const selectedItem = principal.find(
                      (item) => item.id === Array.from(selectedKeys)[0]
                    );
                    if (selectedItem) {
                      handleSelection(selectedItem);
                    }
                  }}
                >
                  {(item) => (
                    <GridList.Item id={item.id}>{item.name}</GridList.Item>
                  )}
                </GridList>
                <p className="my-2 mt-3 text-muted-fg">Edita tus imagenes</p>
                <GridList
                  selectionMode="single"
                  items={options}
                  aria-label="Select your favorite bands"
                  onSelectionChange={(selectedKeys) => {
                    const selectedItem = options.find(
                      (item) => item.id === Array.from(selectedKeys)[0]
                    );
                    if (selectedItem) {
                      handleSelection(selectedItem);
                    }
                  }}
                >
                  {(item) => (
                    <GridList.Item id={item.id}>
                      <div className="flex flex-row justify-between items-center">
                        {item.name}
                        {item.ai && (
                          <Badge className="ml-2" color="primary">
                            AI
                          </Badge>
                        )}
                      </div>
                    </GridList.Item>
                  )}
                </GridList>
              </Popover.Content>
            </Popover>
          </li>
          <li>
            <Link href="https://github.com/uprizingFaze/phantomnary">
              <Button size="square-petite" appearance="outline">
                <IconBrandGithub />
              </Button>
            </Link>
          </li>
          <li className="flex items-center justify-center">
            <ThemeSwitcher />
          </li>
        </ul>
      </nav>
    </section>
  );
}

const principal = [
  { id: "1", name: "Subir una imagen" },
  { id: "2", name: "Ver mis imágenes" },
];
const options = [
  { id: "1", name: "Editar imagen" },
  { id: "2", name: "Generar fondo", ai: "ai" },
  { id: "3", name: "Escalar imagen", ai: "ai" },
  { id: "4", name: "Generar relleno", ai: "ai" },
  { id: "5", name: "Remplazo Generativo", ai: "ai" },
  { id: "6", name: "Eliminación Generativa", ai: "ai" },
];