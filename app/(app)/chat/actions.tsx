"use server";

import { getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import CardTest from "@/components/blocks/card-test";
import { Deploy } from "./tools/deploy";
import ShowTableImage from "@/components/blocks/results";
import { UrlUpload } from "@/components/blocks/url-upload";

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
      showMonthYear: {
        description: "Get month and year",
        parameters: z.object({
          textmessage: z.string().describe("Text message to show"),
          year: z.string().describe("Year by user"),
          month: z.string().describe("month by user"),
        }),
        generate: async ({ month, year, textmessage }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ${textmessage}, ${month} and ${year}`,
            },
          ]);

          return (
            <div>
              <p className="dark:bg-black bg-white dark:text-white border text-black p-2 rounded-lg max-w-3xl z-20 mb-3">
                {textmessage}
              </p>
              <CardTest month={month} year={year} />
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
        description: "Subir imagen",
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
      Deploy,
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}
