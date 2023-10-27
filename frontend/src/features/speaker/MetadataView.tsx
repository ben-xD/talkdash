import { currentTime, difference, startTime } from "../time/timeState.ts";
import { setSpeakerUsername, speakerUsername } from "../user/userState.ts";
import { EditableStateField } from "./EditableStateField.tsx";
import { ShareIcon } from "../../assets/ShareIcon.tsx";
import { HoverCard } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { QrCodeView } from "../../components/QrCodeView.tsx";
import { createSignal, onMount } from "solid-js";

const elapsedTime = () => {
  const start = startTime();
  if (!start) return { formattedDifference: "00:00:00" };
  return difference(start, currentTime());
};

type Props = { reconnectAsSpeaker: (speakerUsername: string) => void };

export const MetadataView = ({ reconnectAsSpeaker }: Props) => {
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
    <div class="py-4 my-2 p-4 rounded-xl flex flex-col gap-4 items-stretch w-full">
      <div class="flex justify-between items-start">
        <p>
          <span class="font-bold tracking-tight">Speaker mode: </span>
          Choose a talk length and start the timer
        </p>
        <div
          class="hover:text-blue-100 active:text-white cursor-pointer"
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
                <HoverCard.Content class="bg-white p-4 rounded-lg">
                  <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow>
                  {hostUrl() ? (
                    <QrCodeView text={hostUrl()!.toString()} />
                  ) : (
                    <></>
                  )}
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="font-bold">Elapsed:</span>
        <span>{elapsedTime().formattedDifference}</span>
      </div>

      <EditableStateField
        label="Username"
        value={speakerUsername}
        setValue={(value) => {
          setSpeakerUsername(value);
          reconnectAsSpeaker(value);
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
