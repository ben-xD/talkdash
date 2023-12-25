import { bearerAuthToken, trpc } from "../../client/trpc.ts";
import { setTimeAction } from "../time/timeState.ts";
import { DateTime } from "luxon";
import { toast } from "solid-toast";
import { addMessage } from "../messages/receivedMessages.tsx";

export const reconnectAsSpeaker = async (speakerUsername: string) => {
  const times = await trpc.speaker.getTimeState.query({ speakerUsername });
  if (times && times.start && times.finish) {
    await setTimeAction({
      startTime: DateTime.fromMillis(times.start),
      finishTime: DateTime.fromMillis(times.finish),
      userTalkLengthInput: "",
    });
    toast(() => <p class="text-secondary-800">Restoring timer from cloud</p>);
  }

  const authToken = bearerAuthToken();
  return trpc.speaker.subscribeMessagesAsSpeaker.subscribe(
    { authToken },
    {
      onData: addMessage,
    },
  );
};
