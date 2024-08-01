"use client";

import { AutoResizeTextarea } from "@/components/auto-resize-textarea";
import { Button } from "@/components/ui/button";
import { ChatFormData, ChatMessage } from "@/lib/chat";
import { useStreamingText } from "@/lib/hooks/use-streaming-text";
import { cn } from "@/lib/utils";
import { CornerDownLeft } from "lucide-react";
import React, {
  Suspense,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface ChatProps {
  messages: ChatMessage[];
  onSubmit?: (data: ChatFormData) => void;
}

export function Chat({ messages, onSubmit }: ChatProps) {
  return (
    <div className="grid h-full w-full grid-rows-[1fr_max-content] overflow-hidden">
      <ChatMessageList messages={messages} />

      <div className="mx-auto w-full max-w-2xl px-4 pb-8 pt-4">
        <ChatForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  scrollingThreshold?: number;
}

function ChatMessageList({
  messages,
  scrollingThreshold = 100,
}: ChatMessageListProps) {
  const container = useRef<HTMLDivElement>(null);
  const scrollBottom = useRef(0);
  const lastMessageId = useMemo(() => messages.at(-1)?.id, [messages]);
  const isScrolling = scrollBottom.current >= scrollingThreshold;

  function scrollToBottom({ behavior }: { behavior?: ScrollBehavior } = {}) {
    if (container.current) {
      container.current.scrollIntoView({ block: "end", behavior });
    }
  }

  const handleScroll: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const scroller = event.currentTarget;
    scrollBottom.current =
      scroller.scrollHeight - (scroller.scrollTop + scroller.clientHeight);
  };

  const handleTextDelta = () => {
    if (!isScrolling) {
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom({ behavior: "smooth" });
  }, [lastMessageId]);

  return (
    <div className="h-full w-full overflow-y-auto" onScroll={handleScroll}>
      <div ref={container} className="mx-auto w-full max-w-2xl px-4 pb-3 pt-6">
        <ol className="grid gap-6">
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              onTextDelta={
                message.id === lastMessageId ? handleTextDelta : undefined
              }
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

interface ChatMessageItemProps {
  message: ChatMessage;
  onTextDelta?: () => void;
}

function ChatMessageItem({ message, onTextDelta }: ChatMessageItemProps) {
  return (
    <li className={cn("flex", { "justify-end": message.role === "user" })}>
      <div
        className={cn("w-full max-w-lg rounded-lg bg-slate-200 p-4", {
          "bg-white": message.role === "assistant",
        })}
      >
        {typeof message.message === "string" ? (
          message.message
        ) : (
          <Suspense fallback={<>loading...</>}>
            <ChatStreamingText
              streamPromise={message.message}
              onTextDelta={onTextDelta}
            />
          </Suspense>
        )}
      </div>
    </li>
  );
}

interface ChatStreamingTextProps {
  streamPromise: Promise<ReadableStream<string>>;
  onTextDelta?: () => void;
}

function ChatStreamingText({
  streamPromise,
  onTextDelta,
}: ChatStreamingTextProps) {
  const stream = use(streamPromise);
  const [text] = useStreamingText(stream, onTextDelta);
  return text;
}

interface ChatFormProps {
  onSubmit?: (data: ChatFormData) => void;
}

function ChatForm({ onSubmit }: ChatFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data: ChatFormData = { message };
    onSubmit?.(data);
    setMessage("");
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <ChatTextarea
        name="message"
        value={message}
        placeholder="Send a message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="absolute right-0 top-0 p-2">
        <Button type="submit" size="icon" className="shadow">
          <CornerDownLeft className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

interface ChatTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function ChatTextarea({ ...props }: ChatTextareaProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    props.onKeyDown?.(event);

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <AutoResizeTextarea
      {...props}
      initialHeight={56} // h-14
      maxHeight={200}
      className={cn(
        "w-full resize-none rounded-lg border py-4 pl-4 pr-14 shadow-sm outline-none",
        props.className,
      )}
      onKeyDown={handleKeyDown}
    />
  );
}
