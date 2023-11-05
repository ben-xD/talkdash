import { onMount } from "solid-js";
import { A } from "@solidjs/router";
import TalkDashImage from "../assets/talkdash-160x160.webp";

const Home = () => {
  onMount(() => {
    document.title = "Talkdash";
  });

  return (
    <div class="my-4 flex max-w-[400px] flex-col gap-4">
      <p class="text-xl">Hey 👋</p>
      <p>
        This is a timer app for events. Speakers see a{" "}
        <span class="font-bold">large timer</span>. Event hosts can send
        messages to speakers.
      </p>
      <p>
        Are you a{" "}
        <A class="font-bold underline" href="/speaker">
          Speaker
        </A>{" "}
        or an{" "}
        <A class="font-bold underline" href="/host">
          Event Host
        </A>
        ?
      </p>
      <hr class="my-4" />
      <p>
        <span class="font-bold">PS:</span> This is a free and open source app
        using Solid, Tailwind, Ark UI, tRPC, Fastify, Node, WebSockets,
        Cloudflare Pages, Fly.io and more. Star the{" "}
        <a
          class="font-bold underline"
          href="https://github.com/ben-xD/talkdash"
        >
          repo
        </a>
        ? 😉😜
      </p>
      <p>
        By{" "}
        <a class="font-bold underline" href="https://orth.uk/">
          Ben Butterworth
        </a>
      </p>
      <a href="https://orth.uk/">
        <img
          src={TalkDashImage}
          alt={"Image of a blue bird called TalkDash."}
          class="w-40 drop-shadow-xl dark:brightness-90"
        />
      </a>
    </div>
  );
};

export default Home;
