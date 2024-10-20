import { createAI } from 'ai/rsc';
import { ServerMessage, ClientMessage, continueConversation } from '@/app/(app)/chat/actions';

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});