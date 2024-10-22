"use client";
import { ThemeSwitcher } from "./theme-toggle";
import { Button, Popover } from "@/components/ui";
import { IconBrandGithub } from "justd-icons";
import { GridList } from "./ui/grid-list";
import { useState } from "react";
import { toast } from "sonner";

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
        <div className="text-lg font-bold">Phantomnary</div>
        <ul className="flex space-x-4 items-center justify-center">
          <li className="flex items-center justify-center">
            <Popover>
              <Button intent="secondary">Prompts</Button>
              <Popover.Content showArrow={true} className="min-w-72">
                <p className="mb-1 text-lg">Prompts</p>
                <GridList
                  selectionMode="single"
                  items={items}
                  aria-label="Select your favorite bands"
                  onSelectionChange={(selectedKeys) => {
                    const selectedItem = items.find(
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
              </Popover.Content>
            </Popover>
          </li>
          <li>
            <Button size="square-petite" appearance="outline">
              <IconBrandGithub />
            </Button>
          </li>
          <li className="flex items-center justify-center">
            <ThemeSwitcher />
          </li>
        </ul>
      </nav>
    </section>
  );
}

const items = [
  { id: "1", name: "Subir una imagen" },
  { id: "2", name: "Ver mis imagenes" },
  { id: "3", name: "Editar imagen" },
  { id: "4", name: "Generar fondo" },

];