import { onMount } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import TalkDashImage from "../assets/talkdash-160x160.webp";
import { isSignedIn } from "../client/trpc.ts";
import { UsersIcon } from "../assets/UsersIcon.tsx";
import { MicIcon } from "../assets/MicIcon.tsx";
import { ConfettiIcon } from "../assets/ConfettiIcon.tsx";

const Home = () => {
  onMount(() => {
    document.title = "Talkdash";
  });

  const [searchParams] = useSearchParams<{
    speakerUsername?: string;
  }>();
  const queryParamWithSpeakerUsername = () =>
    searchParams.speakerUsername
      ? `?speakerUsername=${searchParams.speakerUsername}`
      : "";

  return (
    <div class="my-4 flex max-w-[400px] flex-col gap-12">
      {isSignedIn() ? (
        <p class="text-center text-xl">Welcome 👋, you're logged in</p>
      ) : (
        <></>
      )}
      <p class="text-center">
        Keeping speakers on time and sending them live messages during talks
      </p>
      <div class="flex flex-col gap-8">
        <p class="text-center">
          What's your <span class="font-bold">role?</span>
        </p>
        <div class="flex flex-wrap justify-between gap-4 text-center">
          <A
            class="flex w-24 shrink-0 grow flex-col items-center justify-center gap-2 rounded-lg p-4 outline outline-primary-50 hover:text-primary-200"
            href={`/audience${queryParamWithSpeakerUsername()}`}
          >
            <UsersIcon />
            <p>Audience</p>
          </A>
          <A
            class="flex w-24 shrink-0 grow flex-col items-center justify-center gap-2 rounded-lg p-4 outline outline-primary-50 hover:text-primary-200"
            href="/speaker"
          >
            <MicIcon />
            <p>Speaker</p>
          </A>
          <A
            class="flex w-24 shrink-0 grow flex-col items-center justify-center gap-2 rounded-lg p-4 outline outline-primary-50 hover:text-primary-200"
            href={`/host${queryParamWithSpeakerUsername()}`}
          >
            <ConfettiIcon />
            <p>Event Host</p>
          </A>
        </div>
      </div>
      <div class="flex flex-col gap-4 text-center">
        <p>
          By{" "}
          <a class="font-bold underline" href="https://orth.uk/">
            Ben Butterworth
          </a>
        </p>
        <img
          src={TalkDashImage}
          alt={"Image of a blue bird called TalkDash."}
          class="m-auto block w-40 drop-shadow-xl dark:brightness-90 "
        />
      </div>
    </div>
  );
};

export default Home;
