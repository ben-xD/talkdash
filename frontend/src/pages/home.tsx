import { onMount } from "solid-js";
import { A } from "@solidjs/router";
import TalkDashImage from "../assets/talkdash.png";

const Home = () => {
  onMount(() => {
    document.title = "Talkdash";
  });

  return (
    <div class="my-4 flex flex-col gap-4 max-w-[400px]">
      <p class="text-xl">Welcome 👋</p>
      <p>
        This is a stopwatch app for events. Speakers see a{" "}
        <span class="font-bold">large stopwatch</span>. Event hosts can send
        messages to speakers.
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
      <img
        src={TalkDashImage}
        alt={"Image of a blue bird called TalkDash."}
      ></img>
      <p>
        <span class="font-bold">PS:</span> This is a free and open source app
        using Solid, Tailwind, tRPC, Fastify, Node, WebSockets, Cloudflare
        Pages, Fly.io and more. Star the{" "}
        <a
          class="underline font-bold"
          href="https://github.com/ben-xD/talkdash"
        >
          repo
        </a>
        ? 😉😜
      </p>
      <p>
        By{" "}
        <a class="underline font-bold" href="https://orth.uk/">
          Ben Butterworth
        </a>
      </p>
    </div>
  );
};

export default Home;
