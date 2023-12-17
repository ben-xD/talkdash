import { EditableStateField } from "./EditableStateField";
import { ShareIcon } from "../../assets/ShareIcon";
import { onMount, Show } from "solid-js";
import { ElapsedTime } from "../../components/ElapsedTime";
import { A } from "@solidjs/router";
import {
  isConnectionAuthenticatedWhenNeededPromise,
  isSignedIn,
  preferredUsername,
  setPreferredUsername,
  trpc,
} from "../../client/trpc.ts";
import { cn } from "../../css/tailwind.ts";
import {
  isQrCodeShown,
  setIsQrCodeShown,
} from "../../components/QrCodeView.tsx";
import { Toggle } from "../../components/Toggle.tsx";
import {
  pin,
  Pin,
  isPinRequired,
  setPin,
  setIsPinRequired,
  setPinInternal,
  setIsPinRequiredInternal,
} from "./pin.tsx";
import {
  isAudienceMessagesShown,
  setIsAudienceMessagesShown,
} from "./audienceMessages.ts";
import { registeredUsername } from "../user/userState.tsx";

type Props = {
  reconnectAsSpeaker: (speakerUsername: string) => void;
  class?: string;
  shareUrl: URL;
};

export const SpeakerConfigView = (props: Props) => {
  onMount(async () => {
    // Check if a pin is required, and which one. Set it on local storage.
    if (isSignedIn()) {
      await isConnectionAuthenticatedWhenNeededPromise;
      const pin = await trpc.speaker.getPin.query({});
      if (pin) {
        setIsPinRequiredInternal(true);
        setPinInternal(pin);
        return;
      }
    }
    setIsPinRequiredInternal(false);
    setPinInternal(undefined);
  });

  return (
    <div
      class={cn(
        "my-2 flex w-full flex-col items-stretch gap-4 rounded-xl p-4",
        props.class,
      )}
    >
      <div class="flex items-start justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="lg:text-2xl">Speaker</h1>
          <h2 class="text-sm">
            Choose a talk length and start the timer.{" "}
            <Show when={!isSignedIn()}>
              <span>
                <A class="link" href="/sign-up">
                  Sign up
                </A>{" "}
                to control who can send you messages.
              </span>
            </Show>
          </h2>
        </div>
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
        value={preferredUsername("speaker")}
        setValue={(value) => {
          setPreferredUsername("speaker", value);
          props.reconnectAsSpeaker(value);
        }}
      />
      <div class="flex justify-between">
        <label for="audience-messaging-enabled">
          Show messages from audience
        </label>
        <Toggle
          id="host-pin-enabled"
          aria-label={"Toggle host pin required"}
          checked={isAudienceMessagesShown()}
          setChecked={setIsAudienceMessagesShown}
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between">
          <label for="host-pin-enabled">Require pin for hosts</label>
          <Toggle
            id="host-pin-enabled"
            aria-label={"Toggle host pin required"}
            disabledTooltip={
              "Sign in and register a username to use this feature"
            }
            checked={isPinRequired() && isSignedIn() && !!registeredUsername()}
            disabled={!isSignedIn()}
            setChecked={setIsPinRequired}
          />
        </div>
        {isPinRequired() && isSignedIn() && (
          <Pin setPin={setPin} value={pin()} />
        )}
      </div>
      <div class="flex justify-between">
        <label for="show-qr-code">Show QR code</label>
        <Toggle
          id="show-qr-code"
          aria-label={"Toggle QR code"}
          checked={isQrCodeShown()}
          setChecked={setIsQrCodeShown}
        />
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
