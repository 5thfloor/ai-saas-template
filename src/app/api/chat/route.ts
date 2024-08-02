import { sendMessageToChat } from "@/lib/chat/server";
import { ChatSession } from "@/lib/chat/types";

export async function POST(request: Request) {
  const json = await request.json();
  const message = json.message as string;
  const session = (json.session ?? {
    id: crypto.randomUUID(),
    history: [],
  }) as ChatSession;

  const stream = await sendMessageToChat(message, session);

  return new Response(stream, {
    headers: {
      "content-type": "text/plain",
      "x-session-id": session.id,
    },
  });
}
