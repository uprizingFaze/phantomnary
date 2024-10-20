"use client";

import { Button, TextField } from "@/components/ui";
import { useChat } from "ai/react";
import { IconLaunch, IconRobot } from "justd-icons";
import { ChangeEvent } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const handleTextFieldChange = (value: string) => {
    handleInputChange({ target: { value } } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto stretch">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`whitespace-pre-wrap flex items-start mb-24 ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {m.role === "user" ? (
            <>
              <div className="bg-black dark:bg-white dark:text-black text-white p-2 rounded-lg max-w-3xl z-10">
                {m.toolInvocations ? (
                  <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
                ) : (
                  <p>{m.content}</p>
                )}
              </div>
              <IconLaunch className="h-12 w-12 p-2 ml-2 text-black bg-white rounded-full" />
            </>
          ) : (
            <>
              <IconRobot className="h-12 w-12 p-2 mr-2 rounded-full text-black bg-white" />
              <div className="dark:bg-black bg-white dark:text-white border text-white p-2 rounded-lg max-w-3xl z-10">
                {m.toolInvocations ? (
                  <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
                ) : (
                  <p>{m.content}</p>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 w-full max-w-3xl p-2 mb-8 z-20 flex"
    >
      <TextField
        className="w-full"
        value={input}
        placeholder="Say something..."
        onChange={handleTextFieldChange}
      />
      <Button type="submit" className="ml-2">
        Send
      </Button>
    </form>
    </div>
  );
}
