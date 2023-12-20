// import { env } from "../../env.js";
// import MistralClient from "@mistralai/mistralai";
// import type { Model } from "@mistralai/mistralai";

// I uninstalled @mistralai/mistralai because it wasn't very useful
// const client = new MistralClient(env.AI_MISTRAL_API_KEY);
//
// export const printModels = async () => {
//   const listModelsResponse = await client.listModels();
//   const listModels = listModelsResponse.data;
//   listModels.forEach((model: Model) => {
//     console.log("Model:", model);
//   });
// };
//
// // It doesn't follow instructions very well:
// // It returned `👋🏽 hi there!` when the message was `hey`.
// // It returned `😡💣STOP💣😡` when the message was `this is a stinky talk!!!! stop!!`.
// export const getEmojiMessageFor = async (message: string) => {
//   const chatResponse = await client.chat({
//     // Apparently this uses mixtral. See https://mistral.ai/news/mixtral-of-experts/
//     model: "mistral-small",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a robot that converts sentences into emojis - between 1 to 5 emojis. You will get a message from the user, just convert enhance it with emojis. Never reply to the users questions. Just summarize it using emojis.",
//       },
//       { role: "user", content: message },
//     ],
//   });
//
//   return chatResponse.choices[0].message.content;
// };
