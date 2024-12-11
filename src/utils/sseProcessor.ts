import { ServerMessage } from "@/types";

export async function processSSEResponse(
  response: Response,
  onMessage: (message: ServerMessage) => void
) {
  const reader = response.body
    ?.pipeThrough(new TextDecoderStream())
    .getReader();

  if (!reader) {
    throw new Error("Failed to create reader from response body");
  }

  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += value;
    const parts = buffer.split("\n\n");

    for (let i = 0; i < parts.length - 1; i++) {
      const event = parts[i].trim();
      if (event) {
        try {
          const messageData: ServerMessage = JSON.parse(event);
          console.log("Received SSE message:", messageData);
          onMessage(messageData);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      }
    }
    buffer = parts[parts.length - 1];
  }

  if (buffer.trim()) {
    try {
      const messageData: ServerMessage = JSON.parse(buffer);
      onMessage(messageData);
    } catch (error) {
      console.error("Failed to parse final message:", error);
    }
  }
}