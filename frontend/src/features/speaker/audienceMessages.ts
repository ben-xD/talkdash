import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [isAudienceMessagesShown, setIsAudienceMessagesShown] =
  makePersisted(
    // we don't destructure because makePersisted wants the entire signal
    // eslint-disable-next-line solid/reactivity
    createSignal<boolean>(true),
    {
      name: "is_audience_messaging_enabled",
    },
  );
