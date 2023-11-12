import { env } from "../../env.js";

enum CloudflareWorkersAiModels {
  Llama2 = "@cf/meta/llama-2-7b-chat-int8",
}

async function run(
  model: string,
  input: { messages: { role: string; content: string }[] },
) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${env.CLOUDFLARE_WORKERS_AI_TOKEN}` },
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return await response.json();
}

export const getEmojiMessageFor = async (text: string) => {
  const response = await run(CloudflareWorkersAiModels.Llama2, {
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

// Not reliable, returning unstructured and inconsistent data.
// It seems to get a correct number though.
export const getDurationInMillisecondsFrom = async (text: string) => {
  const response = await run(CloudflareWorkersAiModels.Llama2, {
    messages: [
      {
        role: "system",
        content:
          "Convert the users message into a duration, in seconds. Provide the user only 1 number, with no other words, units or formatting.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.result.response as string;
};
