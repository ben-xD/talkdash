import { setSpeakerUsername, speakerUsername } from "../user/userState";
import { EditableStateField } from "./EditableStateField";
import { ShareIcon } from "../../assets/ShareIcon";
import { Show } from "solid-js";
import { ElapsedTime } from "../../components/ElapsedTime";
import { A } from "@solidjs/router";
import { isSignedIn } from "../../client/trpc.ts";
import { cn } from "../../css/tailwind.ts";

type Props = {
  reconnectAsSpeaker: (speakerUsername: string) => void;
  class?: string;
  shareUrl: URL;
};

export const MetadataView = (props: Props) => {
  return (
    <div
      class={cn(
        "my-2 flex w-full flex-col items-stretch gap-4 rounded-xl p-4",
        props.class,
      )}
    >
      <div class="flex items-start justify-between">
        <p>
          <span class="font-bold tracking-tight">Speaker mode. </span>
          Choose a talk length and start the timer.{" "}
          <Show when={!isSignedIn()}>
            <span>
              <A class="link" href="/sign-up">
                Sign up
              </A>{" "}
              to control who can send you messages.
            </span>
          </Show>
        </p>
        <div
          class="cursor-pointer hover:text-primary-100 active:text-white"
          onClick={async () => {
            await navigator.clipboard.writeText(props.shareUrl.toString());
          }}
        >
          <div aria-label={"Copy URL to speaker to clipboard"}>
            <ShareIcon />
          </div>
        </div>
      </div>
      <ElapsedTime />

      <EditableStateField
        label="Username"
        value={speakerUsername}
        setValue={(value) => {
          setSpeakerUsername(value);
          props.reconnectAsSpeaker(value);
        }}
      />
      {/*Temporarily disable password field since it is not implemented.*/}
      {/*<EditableStateField*/}
      {/*  label="Password"*/}
      {/*  value={password}*/}
      {/*  setValue={setPassword}*/}
      {/*/>*/}
    </div>
  );
};
