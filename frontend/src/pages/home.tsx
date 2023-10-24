import { onMount } from "solid-js";
import { A } from "@solidjs/router";

const Home = () => {
  onMount(() => {
    document.title = "Talkdash";
  });

  return (
    <div class="my-4 flex flex-col gap-2">
      <p class="text-xl">Welcome 👋</p>
      <p>
        Are you a{" "}
        <A class="underline font-bold" href="/speaker">
          Speaker
        </A>{" "}
        or an{" "}
        <A class="underline font-bold" href="/host">
          Event Host
        </A>
        ?
      </p>
    </div>
  );
};

export default Home;
