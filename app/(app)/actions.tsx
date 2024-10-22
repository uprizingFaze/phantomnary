"use server";

import { getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";

import ShowTableImage from "@/components/blocks/table";
import { UrlUpload } from "@/components/blocks/url-upload";
import { EditImage } from "@/components/blocks/edit-image";
import { GenerateBackground } from "@/components/blocks/generate";
import { GenerateMain } from "@/components/blocks/generate-compare";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-4o-mini"),
    messages: [...history.get(), { role: "user", content: input }],
    system:
      `Eres amable` +
      `La url ya esta seleccionada, tu solo las las transformations que se requieran segun el usuario` +
      `Eres un experto en cloudinary, el contexto es que eres un BotChat que se encarga de modificar imagenes de cloudinary ` +
      `Puedes, subir una imagen, ver las imagenes, editar una imagen, generar un backgroun, generar upscale o escalado` +
      `Sabes todo sobre Transformation URL API reference, especialmente sobre las transformaciones con AI Etc ` +
      `Estructura URL: https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension> ` +
      `En mi caso seria: https://res.cloudinary.com/dars3e4eo/image/upload/<transformations>/<version>/<public_id_full_path>.<extension>` +
      `Algunas Url de ejemplo: https://res.cloudinary.com/dars3e4eo/image/upload/v1729545913/cld-sample-3.jpg
      https://res.cloudinary.com/dars3e4eo/image/upload/v1729566905/wp11vu4hldpcwltfef96.jpg ` +
      `Recuerda que las imagenes las transformations son sobre la URL por ejemplo` +
      `https://res.cloudinary.com/demo/image/upload/bo_40px_solid_brown/autumn_leaves.jpg` +
      `https://res.cloudinary.com/demo/image/upload/cs_srgb/face_top.jpg` +
      `Manten el la URL con todas las transformaciones que vayas haciendo a menos que yo te diga que borres alguna transformacion` +
      `Recuerda utiliza correctamente las transformaciones de cloudinary, recuerda que son las de la url` +
      `Algunos ejemplos de transformaciones son: bo_40px_solid_brown, cs_srgb, e_sepia, g_north_west, h_200, w_200, x_10, y_10, z_1.5, a_90, c_scale,w_300/e_upscale, e_gen_background_replace[:prompt_<prompt>][;seed_<seed>], e_gen_recolor:prompt_(<prompt 1>[;...;<prompt n>]);to-color_<color>[;multiple_<detect multiple>], e_gradient_fade[:<type>][:<strength>], e_background_removal[:fineedges_<enable fine edges>], e_background_removal` +
      `b_gen_fill[:prompt_<prompt>][;ignore-foreground_<ignore foreground>][;seed_<seed>] ` +
      `No agregues mas tranformations o props de las que el usuario pide` +
      `Siempre recuerda que las transformaciones y ve agregando lo que pidan a menos que el usuario quiera iniciar de nuevo`,
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return (
        <div className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg max-w-3xl z-50">
          {content}
        </div>
      );
    },
    tools: {
      editImage: {
        description:
          "Editar imagen, cuando el usuariuo pida que quiere ajustar editar etc la imagen",
        parameters: z.object({
          textmessage: z.string().describe("Text message to show"),
          transformations: z
            .string()
            .describe("Transformaciones en la api url cloudinary"),
        }),
        generate: async ({ textmessage, transformations }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg z-20 mb-3">
                {textmessage}
              </p>
              <EditImage transformations={transformations} />
            </div>
          );
        },
      },
      showImages: {
        description: "Mostrar imágenes subidas",
        parameters: z.object({
          textmessage: z.string().describe("Text message to show"),
        }),
        generate: async ({ textmessage }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg max-w-3xl z-20 mb-3">
                {textmessage}
              </p>
              <ShowTableImage />
            </div>
          );
        },
      },
      uploadImage: {
        description: "Subir imagen, cuando el usuario pida subir una imagen",
        parameters: z.object({
          textmessage: z.string().describe("Text message to show"),
        }),
        generate: async ({ textmessage }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg z-20 mb-3">
                {textmessage}
              </p>
              <UrlUpload />
            </div>
          );
        },
      },
      genBackground: {
        description:
          "Generar el fondo, cuando el usuario pida cambiar, generar o quitar el fondo",
        parameters: z.object({
          textmessage: z.string().describe("Texto de respuesta del bot"),
          transformations: z
            .string()
            .describe(
              "ejemplos de transformaciones de cloudinary: e_gen_background_replace:prompt_an%20empty%20beach Ah agregale al promp algo de horror siempre, no agreges mas datos transformations solo da el e_gen_background_replace:prompt_an..."
            ),
        }),
        generate: async ({ textmessage, transformations }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg z-20 mb-3">
                {textmessage}
              </p>
              <GenerateBackground transformations={transformations} />
            </div>
          );
        },
      },
      genUpscale: {
        description:
          "Generar escalado, cuando el usuario pida escalar la imagen",
        parameters: z.object({
          textmessage: z.string().describe("Text message to show"),
          transformations: z
            .string()
            .describe(
              "ejemplos de transformaciones de cloudinary: c_scale,w_400, e_upscale"
            ),
        }),
        generate: async ({ textmessage, transformations }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg z-20 mb-3">
                {textmessage}
              </p>
              <GenerateMain transformations={transformations} />
            </div>
          );
        },
      },
      genFill: {
        description:
          "Generar fill o relleno, cuando el usuario pida generar fill o relleno a la imagen",
        parameters: z.object({
          textmessage: z.string().describe("Un mensaje para mostrar"),
          transformations: z
            .string()
            .describe(
              "crea Generative Fill, ejemplos de Generative Fill de cloudinary: ar_1:1,b_gen_fill,c_pad,w_1500 o si te dan un prompt b_gen_fill:prompt_bowls%20of%20cereal,c_pad,h_1800,w_1000,g_south  No olvides añadir al promp algo de Horros siempre"
            ),
        }),
        generate: async ({ textmessage, transformations }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg z-20 mb-3">
                {textmessage}
              </p>
              <GenerateMain transformations={transformations} />
            </div>
          );
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}
