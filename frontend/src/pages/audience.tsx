import { onMount } from "solid-js";
import { A } from "@solidjs/router";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
  });

  return (
    <div>
      <p>Audience Page</p>
      <p>
        The audience cannot do anything yet. Switch to{" "}
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
