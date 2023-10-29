import OpenAI from "openai";
import { env } from "../../env.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const getDurationInSecondsFrom = async (text: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Convert the users next message content into a duration in seconds. Provide the user only 1 number, with no other words, units or formatting. For example, if the user says '5 minutes', you should return '300'. If the user says 'the time it takes for the average person to run 100m', you should return '20'.",
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
