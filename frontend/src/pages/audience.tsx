import { onMount } from "solid-js";
import { A } from "@solidjs/router";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
  });

  return (
    <div class="flex max-w-[400px] flex-col gap-4 py-4">
      <p class="font-bold">Audience Mode</p>
      <p>
        Ohhh dear. The audience cannot do anything yet. Want some features for
        the audience? Find or create a{" "}
        <a
          href="https://github.com/ben-xD/talkdash/issues/new"
          class="font-bold underline"
        >
          GitHub issue
        </a>
        .
      </p>
      <p>
        Switch to{" "}
        <A class="font-bold underline" href="/speaker">
          Speaker
        </A>{" "}
        or{" "}
        <A class="font-bold underline" href="/host">
          Event Host
        </A>{" "}
        mode.
      </p>
    </div>
  );
};

export default Audience;
