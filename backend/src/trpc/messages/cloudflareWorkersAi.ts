import { env } from "../../env";

async function run(
  model: string,
  input: { messages: { role: string; content: string }[] },
) {
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
          "Give a few emojis that represent the message provided by the user. Don't return any words. Only provide emojis.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.result.response as string;
};
