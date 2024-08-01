export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  message: string | Promise<ReadableStream<string>>;
};

export type ChatFormData = {
  message: string;
};
