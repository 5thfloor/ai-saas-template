import "server-only";

import { custom } from "@/custom";
import {
  BaseChatMessageHistory,
  BaseListChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { ChatSession } from "./types";

interface HistoryRepository {
  getHistory(
    session: ChatSession,
  ): Promise<BaseChatMessageHistory | BaseListChatMessageHistory>;
}

const model = new ChatOpenAI({
  model: custom.LLM_MODEL,
  temperature: 0,
});
const prompt = ChatPromptTemplate.fromMessages([
  ["system", custom.SYSTEM_PROMPT],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);
const parser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(parser);

export async function sendMessageToChat(
  message: string,
  session: ChatSession,
): Promise<ReadableStream<string>> {
  const historyRepository = getHistoryRepository();
  const history = await historyRepository.getHistory(session);
  const chat = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: () => history,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  return await chat.stream(
    { input: message },
    { configurable: { sessionId: session.id } },
  );
}

function getHistoryRepository(): HistoryRepository {
  // TODO: Add a database repository after supporting database
  return {
    async getHistory(session: ChatSession) {
      const history = new InMemoryChatMessageHistory();
      history.addMessages(
        session.history.map((msg) => {
          switch (msg.role) {
            case "user":
              return new HumanMessage({ content: msg.message });
            case "assistant":
              return new AIMessage({ content: msg.message });
          }
        }),
      );
      return history;
    },
  };
}
