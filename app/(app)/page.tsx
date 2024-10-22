"use client";

import { useState, useEffect, useRef } from "react";
import { ClientMessage } from "@/app/(app)/actions";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { Button, TextField } from "@/components/ui";
import { IconGhost, IconUser } from "@tabler/icons-react";

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-24 stretch">
      {conversation.map((message: ClientMessage) => (
        <div
          key={message.id}
          className={`whitespace-pre-wrap flex items-start mb-24 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "user" ? (
            <>
              <div className="bg-black dark:bg-white dark:text-black text-white p-2 rounded-lg max-w-3xl z-10">
                <p>{message.display}</p>
              </div>
              <IconUser className="h-12 w-12 p-2 ml-2 text-black dark:text-white border bg-overlay rounded-full z-10" />
            </>
          ) : (
            <>
              <IconGhost className="h-12 w-12 p-2 mr-2 rounded-full text-white bg-black dark:text-black dark:bg-white z-10" />
              <p className="z-20">{message.display}</p>
            </>
          )}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            { id: generateId(), role: "user", display: input },
          ]);

          const message = await continueConversation(input);

          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            message,
          ]);

          setInput("");
        }}
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl p-2 mb-8 z-20 flex"
      >
        <TextField
          className="w-full"
          value={input}
          placeholder="Enviar un mensaje"
          onChange={(value: string) => setInput(value)}
          aria-label="Campo de texto para enviar un mensaje"
        />
        <Button type="submit" className="ml-2">
          Send
        </Button>
      </form>
    </div>
  );
}