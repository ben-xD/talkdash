import { setSpeakerUsername, speakerUsername } from "../user/userState";
import { EditableStateField } from "./EditableStateField";
import { ShareIcon } from "../../assets/ShareIcon";
import { Show } from "solid-js";
import { ElapsedTime } from "../../components/ElapsedTime";
import { A } from "@solidjs/router";
import { isSignedIn } from "../../client/trpc.ts";
import { cn } from "../../css/tailwind.ts";
import {
  isQrCodeShown,
  setIsQrCodeShown,
} from "../../components/QrCodeView.tsx";

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
      <div class="flex justify-between">
        <p>Show QR code</p>
        <button
          class={cn(
            "relative inline-flex h-6 w-11 cursor-pointer rounded-full border-[2px] border-transparent bg-opacity-100 transition-all duration-200 ease-in-out focus:ring focus:ring-primary-500",
            { "bg-primary-500": isQrCodeShown() },
          )}
          role="switch"
          type="button"
          aria-checked={isQrCodeShown()}
          onClick={() => setIsQrCodeShown(!isQrCodeShown())}
        >
          <span class="absolute m-[-1px] h-[1px] w-[1px] shrink-0 overflow-hidden whitespace-nowrap border-0 p-0">
            Toggle QR code
          </span>
          <span
            aria-hidden="true"
            class={cn(
              "h-5 w-5 rounded-full bg-primary-50 transition-all duration-200 ease-in-out",
              {
                "translate-x-0": !isQrCodeShown(),
                "translate-x-5": isQrCodeShown(),
              },
            )}
          ></span>
        </button>
        {/*<input*/}
        {/*  type="checkbox"*/}
        {/*  class="toggle border-primary-500 bg-primary-500 hover:bg-primary-300"*/}
        {/*  checked={isQrCodeShown()}*/}
        {/*  onChange={(e) => setIsQrCodeShown(e.target.checked)}*/}
        {/*/>*/}
      </div>
      {/*Temporarily disable password field since it is not implemented.*/}
      {/*<EditableStateField*/}
      {/*  label="Password"*/}
      {/*  value={password}*/}
      {/*  setValue={setPassword}*/}
      {/*/>*/}
    </div>
  );
};
