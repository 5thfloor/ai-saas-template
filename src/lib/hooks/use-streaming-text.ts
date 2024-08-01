import { useEffect, useState, useTransition } from "react";

export function useStreamingText(
  stream: ReadableStream<string>,
  onTextDelta?: (delta: string) => void,
) {
  const [text, setText] = useState("");
  const [isStreaming, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setText("");
      const reader = stream.getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        setText((text) => text + value);
        onTextDelta?.(value);
      }
    });
  }, [stream]);

  return [text, isStreaming];
}
