import { env } from "../../env";

async function run(model: string, input: any) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/***REMOVED***/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${env.CLOUDFLARE_WORKERS_AI_TOKEN}` },
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return await response.json();
}

export const getEmojiMessageFor = async (text: string) => {
  const response = await run("@cf/meta/llama-2-7b-chat-int8", {
    messages: [
      {
        role: "system",
        content:
          "You are a friendly assistant that converts messages into emojis. You will get a message from the user, just convert enhance it with emojis. Don't reply to any questions.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.result.response as string;
};
