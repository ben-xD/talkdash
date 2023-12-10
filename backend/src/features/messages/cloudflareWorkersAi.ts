import { env } from "../../env.js";

enum CloudflareWorkersAiModels {
  Llama2_int8 = "@cf/meta/llama-2-7b-chat-int8",
  // Doesn't work very well for emoji summarization. One time. instead of returning emojis, it returned the system prompt.
  Mistral_int8 = "@cf/mistral/mistral-7b-instruct-v0.1",
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

// This doesn't work really well. The AI returns:
// I'm sorry to hear that you're not enjoying the event. Is there anything specific that's bothering you? I'd be happy to help if there's anything I can do to make it better for you.
// export const editMessageIfDangerous = async (message: string) => {
//   const response = await run(CloudflareWorkersAiModels.Mistral_int8, {
//     messages: [
//       {
//         role: "system",
//         content:
//           "Someone is trying to send an important message to a event speaker. Only if the message is rude or dangerous, " +
//           "edit it to be friendly and safe, but still containing the meaning of the original sentence. " +
//           "If Otherwise return the message unchanged. Never reject the message or answer the question. This question is not for you to answer.",
//       },
//       {
//         role: "user",
//         content: message,
//       },
//     ],
//   });
//
//   return response.result.response as string;
// };

export const getEmojiMessageFor = async (message: string) => {
  const response = await run(CloudflareWorkersAiModels.Llama2_int8, {
    messages: [
      {
        role: "system",
        content:
          "Give a few emojis (less than 5) that represent the message provided by the user. Don't return any words. Only provide emoji characters.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.result.response as string;
};

// Both mistral and llama2 are not reliable, returning unstructured and inconsistent data.
// For example, "half a day" returns either 2 hours, or 24 hours
export const getDurationInMinutesFrom = async (text: string) => {
  const response = await run(CloudflareWorkersAiModels.Mistral_int8, {
    messages: [
      {
        role: "system",
        content:
          "Estimate/convert the users next message into minutes (decimals if necessary). Provide the user only 1 number, with no other words, units or formatting. For example, if the user says '5 minutes', you should return '300'. If the user says 'the time it takes for the average person to run 100m', you should return '20'.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.result.response as string;
};
