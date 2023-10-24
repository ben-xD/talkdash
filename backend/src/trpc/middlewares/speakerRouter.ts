import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { loggedProcedure } from "./middleware";
import { router } from "../trpc";

export const speakerRouter = router({
  // Unused
  createSpeaker: loggedProcedure
    .input(z.object({}))
    .output(
      z.object({
        speakerId: z.string(),
      }),
    )
    .mutation(() => {
      return { speakerId: uuidv4() };
    }),
});
