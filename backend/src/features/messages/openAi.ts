import OpenAI from "openai";
import { env } from "../../env.js";

// Using Cloudflare AI Gateway as per https://developers.cloudflare.com/ai-gateway/get-started/connecting-applications#openai
const openai = new OpenAI({
  baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/talkdash-openai/openai`,
  apiKey: env.OPENAI_API_KEY,
});

export const getDurationInMinutesFrom = async (text: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Convert the users next message content into a duration in minutes (decimals if necessary). Provide the user only 1 number, with no other words, units or formatting. For example, if the user says '5 minutes', you should return '300'. If the user says 'the time it takes for the average person to run 100m', you should return '20'.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(chatCompletion.choices);
  const durationString = chatCompletion.choices[0]?.message.content;
  if (durationString) {
    return parseFloat(durationString);
  }
};

export const getEmojiMessageFor = async (message: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a robot that converts sentences into emojis - between 1 to 5 emojis. You will get a message from the user, just convert enhance it with emojis. Never reply to the users questions. Just summarize it using emojis.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0]?.message.content ?? undefined;
};
