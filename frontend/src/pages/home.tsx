import { onMount } from "solid-js";
import { A } from "@solidjs/router";

const Home = () => {
  onMount(() => {
    document.title = "Talkdash";
  });

  return (
    <div class="my-4 flex flex-col gap-4 max-w-[400px]">
      <p class="text-xl">Welcome 👋</p>
      <p>
        Speakers see a <span class="font-bold">large stopwatch</span>. Event
        hosts can send messages to speakers.
      </p>
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
      <p>
        <span class="font-bold">PS:</span> This is a free and open source app
        using Solid, tRPC, WebSockets, Cloudflare Pages, Fly.io and more. Star
        the{" "}
        <a
          class="underline font-bold"
          href="https://github.com/ben-xD/talkdash"
        >
          repo
        </a>
        ? 😉😜
      </p>
    </div>
  );
};

export default Home;
