"use client";

import { Chat } from "@/components/chat";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { custom } from "@/custom";
import { ChatFormData, ChatMessage } from "@/lib/chat";
import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleSubmit(data: ChatFormData) {
    // DEBUG
    setMessages((messages) => [
      ...messages,
      { id: crypto.randomUUID(), role: "user", message: data.message },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        message: (async () => {
          await new Promise((r) => setTimeout(r, 2000));
          return new ReadableStream({
            async start(controller) {
              for (let i = 0; i < 100; i++) {
                controller.enqueue("dummy ");
                await new Promise((r) => setTimeout(r, 100));
              }
            },
          });
        })(),
      },
    ]);
  }

  return (
    <div className="grid h-full grid-rows-[max-content_1fr]">
      {messages.length === 0 ? (
        <div className="mx-auto w-full max-w-2xl px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to {custom.APP_NAME}!</CardTitle>
              <CardDescription>
                Excellent AI chatbot to assist you in your work.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div /> // placeholder
      )}

      <Chat messages={messages} onSubmit={handleSubmit} />
    </div>
  );
}
