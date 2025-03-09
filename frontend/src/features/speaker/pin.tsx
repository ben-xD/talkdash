import { createSignal, Index } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { trpc } from "../../client/trpc.ts";
import { toast } from "solid-toast";
import { TRPCClientError } from "@trpc/client";
import { PinInput } from "@ark-ui/solid";
import { cn } from "../../css/tailwind.ts";

export const [isPinRequired, setIsPinRequiredInternal] = makePersisted(
  createSignal<boolean>(false),
  {
    name: "is_host_pin_required",
  },
);
export const setIsPinRequired = async (isRequired: boolean) => {
  setIsPinRequiredInternal(isRequired);
  try {
    await trpc.speaker.setPin.mutate({ isRequired });
  } catch (e) {
    setIsPinRequiredInternal(false);
  }
};

export const [pinInternal, setPinInternal] = makePersisted(
  createSignal<string | undefined>(undefined),
  {
    name: "host_pin",
  },
);

export const pin = pinInternal;

// The state the senders set before sending a message
export const [sendersPin, setSendersPin] =
  makePersisted(createSignal<string | undefined>());

export const [isSendersPinRequired, setIsSendersPinRequired] = createSignal<
  boolean | undefined
>();

export const setPin = async (newPin: string | undefined) => {
  setPinInternal(newPin);
  // TODO if pin is different, stop trusting existing
  // TODO don't allow a different speaker to connect as same username if it has a pin.
  try {
    await trpc.speaker.setPin.mutate({ pin: newPin });
    toast(() => (
      <p class="text-secondary-800">Your pin was set successfully</p>
    ));
  } catch (e) {
    if (e instanceof TRPCClientError) {
      const message = e.message;
      toast(() => (
        <p class="text-secondary-800">Failed to set pin. {message}</p>
      ));
    } else {
      toast(() => (
        <p class="text-secondary-800">
          Failed to set pin. Something went wrong.
        </p>
      ));
    }
  }
};

export const Pin = (props: {
  setPin: (pin: string) => void;
  value?: string;
}) => {
  return (
    <PinInput.Root
      mask
      value={props.value?.split("")}
      placeholder="*"
      class="flex flex-col"
      onValueComplete={(e) => props.setPin(e.valueAsString)}
    >
      <PinInput.Label class="font-bold">Host pin</PinInput.Label>
      <PinInput.Control class="mt-2 flex w-2 gap-2">
        <Index each={[0, 1, 2, 3]}>
          {(id) => (
            <PinInput.Input
              class="w-9 rounded-md bg-primary-50 p-2 text-center text-primary-800 dark:bg-primary-900 dark:text-primary-200"
              index={id()}
            />
          )}
        </Index>
      </PinInput.Control>
    </PinInput.Root>
  );
};

export const PinAttempt = (props: {
  setPin: (pin: string) => void;
  value?: string;
  isCorrect: boolean | undefined;
}) => {
  return (
    <PinInput.Root
      mask
      value={props.value?.split("")}
      placeholder="*"
      class="flex flex-col"
      onValueComplete={(e) => props.setPin(e.valueAsString)}
    >
      <PinInput.Label class="font-bold">Host pin</PinInput.Label>
      <PinInput.Label>This speaker requires a pin</PinInput.Label>
      <PinInput.Control class="mt-2 flex w-2 gap-2">
        <Index each={[0, 1, 2, 3]}>
          {(id) => (
            <PinInput.Input
              class={cn(
                "w-9 rounded-md bg-primary-50 p-2 text-center text-primary-800 dark:bg-primary-900 dark:text-primary-200",
                {
                  "border-2 border-red-500": !props.isCorrect,
                  "border-2 border-primary-500": props.isCorrect,
                },
              )}
              index={id()}
            />
          )}
        </Index>
      </PinInput.Control>
    </PinInput.Root>
  );
};
