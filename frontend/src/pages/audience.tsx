import { onMount } from "solid-js";
import { A } from "@solidjs/router";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
  });

  return (
    <div class="max-w-[400px] flex flex-col gap-4 py-4">
      <p class="font-bold">Audience Mode</p>
      <p>
        Ohhh dear. The audience cannot do anything yet. Want some features for
        the audience? Find or create a{" "}
        <a
          href="https://github.com/ben-xD/talkdash/issues/new"
          class="underline font-bold"
        >
          GitHub issue
        </a>
        .
      </p>
      <p>
        Switch to{" "}
        <A class="underline font-bold" href="/speaker">
          Speaker
        </A>{" "}
        or{" "}
        <A class="underline font-bold" href="/host">
          Event Host
        </A>{" "}
        mode.
      </p>
    </div>
  );
};

export default Audience;
