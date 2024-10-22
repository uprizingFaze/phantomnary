// deploy.tsx
import { z } from "zod";
import { ServerMessage } from "../actions";
import { getMutableAIState } from "ai/rsc";

export const Deploy = {
  description: "Deploy repository to vercel",
  parameters: z.object({
    repositoryName: z
      .string()
      .describe("The name of the repository, example: vercel/ai-chatbot"),
  }),
  generate: async function* ({ repositoryName }: { repositoryName: string }) {
    const history = getMutableAIState(); // Mover la llamada aquí

    history.done((messages: ServerMessage[]) => [
      ...messages,
      {
        role: "assistant",
        content: `Showing ${repositoryName}`,
      },
    ]);

    yield <div>Cloning repository {repositoryName}...</div>;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    yield <div>Building repository {repositoryName}...</div>;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return <div>{repositoryName} deployed!</div>;
  },
};