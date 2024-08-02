export type ChatMessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  message: string | Promise<ReadableStream<string>>;
};

export type ChatFormData = {
  message: string;
};

export type ChatSession = {
  id: string;
  history: { role: ChatMessageRole; message: string }[];
};
