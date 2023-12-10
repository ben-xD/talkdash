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
    <div class="my-4 flex max-w-[400px] flex-col gap-12">
      {isSignedIn() ? (
        <p class="text-xl">Welcome 👋, you're logged in</p>
      ) : (
        <p class="text-xl">Hey 👋</p>
      )}
      <p>
        This is a timer for events. Speakers see a{" "}
        <span class="font-bold">large timer</span>. Audience and hosts can send
        them messages.
      </p>
      <div class="flex flex-col gap-8 text-sm">
        <p>What's your role?</p>
        <div class="flex flex-wrap justify-between gap-4 text-center">
          <A
            class="flex w-24 shrink-0 grow flex-col items-center justify-center gap-2 rounded-lg p-4 outline outline-primary-100 hover:text-primary-200"
            href="/audience"
          >
            <UsersIcon />
            <p>Audience</p>
          </A>
          <A
            class="flex w-24 shrink-0 grow flex-col items-center justify-center gap-2 rounded-lg p-4 outline outline-primary-100 hover:text-primary-200"
            href="/speaker"
          >
            <MicIcon />
            <p>Speaker</p>
          </A>
          <A
            class="flex w-24 shrink-0 grow flex-col items-center justify-center gap-2 rounded-lg p-4 outline outline-primary-100 hover:text-primary-200"
            href="/host"
          >
            <ConfettiIcon />
            <p>Event Host</p>
          </A>
        </div>
      </div>
      <div class="flex flex-col gap-4">
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
    </div>
  );
};

export default Home;
