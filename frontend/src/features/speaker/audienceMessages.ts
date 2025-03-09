import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [isAudienceMessagesShown, setIsAudienceMessagesShown] =
  makePersisted(createSignal<boolean>(true), {
    name: "is_audience_messaging_enabled",
  });
