import { onMount } from "solid-js";
import { A } from "@solidjs/router";
import TalkDashImage from "../assets/talkdash-160x160.webp";
import { isSignedIn } from "../client/trpc.ts";
import { UsersIcon } from "../assets/UsersIcon.tsx";
import { MicIcon } from "../assets/MicIcon.tsx";
import { ConfettiIcon } from "../assets/ConfettiIcon.tsx";

const Home = () => {
  onMount(() => {
    document.title = "Talkdash";
  });

  return (
    <div class="my-4 flex max-w-[400px] flex-col gap-4">
      {isSignedIn() ? (
        <p class="text-xl">Welcome 👋, you're logged in</p>
      ) : (
        <p class="text-xl">Hey 👋</p>
      )}
      <p>
        This is a timer app for events. Speakers see a{" "}
        <span class="font-bold">large timer</span>. Audience and hosts can send
        them messages.
      </p>
      <div class="flex flex-col gap-4">
        <p>What's your role?</p>
        <div class="flex flex-wrap justify-between">
          <A
            class="flex flex-col items-center hover:text-primary-200"
            href="/audience"
          >
            <UsersIcon />
            <p>Audience</p>
          </A>
          <A
            class="flex flex-col items-center hover:text-primary-200"
            href="/speaker"
          >
            <MicIcon />
            <p>Speaker</p>
          </A>
          <A
            class="flex flex-col items-center hover:text-primary-200"
            href="/host"
          >
            <ConfettiIcon />
            <p>Event Host</p>
          </A>
        </div>
      </div>
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
