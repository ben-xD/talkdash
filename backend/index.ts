import Bao, {IWebSocketData} from "baojs";
import {ServerWebSocket} from "bun";
import {z} from "zod";

const app = new Bao();

app.get("/", (ctx) => {
  return ctx.sendText("🌭");
});

// Ping/pong
app.ws("/ping", {
  message: (ws, msg) => {
    ws.send("pong");
  },
});

type SpeakerId = string;
type Speaker = {
  ws: ServerWebSocket<IWebSocketData>,
  messages: string[]
};
const speakersById = new Map<SpeakerId, Speaker>();

app.ws("/speakers/:speakerId", {
  open: (ws) => {
    const speakerId = ws.data.ctx.params.speakerId;
    if (!speakerId) {
      return ws.close(1000, "No speaker ID provided");
    } else {
      ws.data.speakerId = speakerId;
      // Check the ID is not connected anymore.
      // ws.data.uuid = uuidv4();
      // ws.publish(speakerId, `New speaker "${speakerId}"`);
      if (!speakersById.has(speakerId)) {
        speakersById.set(speakerId, {messages: [], ws});
      }
      ws.subscribe(speakerId);
    }
  },
  close: (ws) => {
    const speakerId = ws.data.speakerId;
    speakersById.delete(speakerId);
    // ws.publish(speakerId, `Speaker "${speakerId}" disconnected`);
    ws.unsubscribe(speakerId);
  },
  // We don't send any messages when a speaker sends a message.
  // message: (ws, msg) => {},
});

// TODO Implement viewer API (shows existing questions).
// TODO Implement host API (send message, moderate questions?).
// app.ws('/host/:hostId', {})

const messageRequest = z.object({
  message: z.string()
});
type MessageRequest = z.infer<typeof messageRequest>;

app.put("/speakers/:speakerId/messages", async (ctx) => {
  const speakerId = ctx.params.speakerId;
  const rawBody = await ctx.req.json();
  const body = messageRequest.parse(rawBody);
  const speaker = speakersById.get(speakerId);
  if (speaker) {
    speaker.messages.push(body.message);
    speaker.ws.publish(speakerId, body.message)
    return ctx.sendEmpty({status: 200})
  }
  // Need to use `headers: {}` to avoid TypeError: undefined is not an object
  // (evaluating 'options.headers["Content-Type"] = "application/json"')
  return ctx.sendJson({"error": `Speaker ${speakerId} doesn't exist.`}, {status: 400, headers: {}})
});

const server = app.listen({port: parseInt(process.env.PORT) || 4000});
console.log(`Listening on ${server.hostname}:${server.port}`);