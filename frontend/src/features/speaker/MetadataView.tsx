import { setSpeakerUsername, speakerUsername } from "../user/userState.js";
import { EditableStateField } from "./EditableStateField.tsx";
import { ShareIcon } from "../../assets/ShareIcon.tsx";
import { HoverCard } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { QrCodeView } from "../../components/QrCodeView.tsx";
import { createSignal, onMount, Show } from "solid-js";
import { ElapsedTime } from "../../components/ElapsedTime.tsx";

type Props = { reconnectAsSpeaker: (speakerUsername: string) => void };

export const MetadataView = (props: Props) => {
  const getHostUrl = (): URL => {
    const hostUrl = new URL("../host", window.location.href);
    const username = speakerUsername();
    if (username) {
      hostUrl.searchParams.set("speakerUsername", username);
    }
    return hostUrl;
  };

  const [hostUrl, setHostUrl] = createSignal<URL | undefined>();
  onMount(() => {
    setHostUrl(getHostUrl());
  });

  return (
    <div class="my-2 flex w-full flex-col items-stretch gap-4 rounded-xl p-4 py-4">
      <div class="flex items-start justify-between">
        <p>
          <span class="font-bold tracking-tight">Speaker mode: </span>
          Choose a talk length and start the timer.
        </p>
        <div
          class="cursor-pointer hover:text-blue-100 active:text-white"
          onClick={async () => {
            const hostUrl = getHostUrl();
            await navigator.clipboard.writeText(hostUrl.toString());
          }}
        >
          <HoverCard.Root>
            <HoverCard.Trigger>
              <ShareIcon />
            </HoverCard.Trigger>
            <Portal>
              <HoverCard.Positioner class="z-20">
                <HoverCard.Content class="rounded-lg bg-white p-4">
                  <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow>
                  <Show
                    when={hostUrl()}
                    fallback={<h2>Couldn't get generate a QR code.</h2>}
                  >
                    {(hostUrl) => <QrCodeView text={hostUrl.toString()} />}
                  </Show>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
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
