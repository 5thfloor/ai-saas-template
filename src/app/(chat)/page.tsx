"use client";

import { Chat } from "@/components/chat";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { custom } from "@/custom";
import { ChatFormData, ChatMessage, ChatSession } from "@/lib/chat/types";
import {
  createTextStreamBuffer,
  TextDecodeTransformStream,
} from "@/lib/stream";
import { useRef, useState } from "react";

async function postChatMessage(data: {
  message: string;
  session: ChatSession | null;
}): Promise<{ stream: ReadableStream<string>; sessionId: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const sessionId = res.headers.get("x-session-id");
  if (!res.ok || !res.body || !sessionId) {
    throw new Error("Cannot stream chat response");
  }
  const stream = res.body.pipeThrough(new TextDecodeTransformStream());
  return { stream, sessionId };
}

export default function Page() {
  const session = useRef<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleSubmit(data: ChatFormData) {
    const messagePromise = postChatMessage({
      message: data.message,
      session: session.current,
    }).then(({ stream, sessionId }) => {
      if (!session.current) {
        session.current = { id: sessionId, history: [] };
      }

      // Add user message to history
      session.current.history.push({ role: "user", message: data.message });

      // Add assistant message to history when the stream is completed
      const buffer = createTextStreamBuffer();
      buffer.promise.then((message) => {
        session.current?.history.push({ role: "assistant", message });
      });

      return stream.pipeThrough(buffer.collector);
    });

    setMessages((messages) => [
      ...messages,
      { id: crypto.randomUUID(), role: "user", message: data.message },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        message: messagePromise,
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
