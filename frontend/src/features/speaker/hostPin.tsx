import { createSignal, Index } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { trpc } from "../../client/trpc.ts";
import { toast } from "solid-toast";
import { TRPCClientError } from "@trpc/client";
import { PinInput } from "@ark-ui/solid";

export const [isHostPinRequired, setIsHostPinRequired] = makePersisted(
  // we don't destructure because makePersisted wants the entire signal
  // eslint-disable-next-line solid/reactivity
  createSignal<boolean>(false),
  {
    name: "is_host_pin_required",
  },
);

export const [hostPinInternal, setHostPinInternal] = makePersisted(
  // we don't destructure because makePersisted wants the entire signal
  // eslint-disable-next-line solid/reactivity
  createSignal<string | undefined>(undefined),
  {
    name: "host_pin",
  },
);

export const hostPin = hostPinInternal;

export const setHostPin = async (newHostPin: string | undefined) => {
  setHostPinInternal(newHostPin);
  // TODO if pin is different, stop trusting existing
  // TODO don't allow a different speaker to connect as same username if it has a pin.
  try {
    await trpc.speaker.setHostPin.mutate({ pin: newHostPin });
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

export const HostPin = () => {
  return (
    <PinInput.Root
      mask
      placeholder="*"
      class="flex flex-col gap-2"
      onValueComplete={(e) => setHostPin(e.valueAsString)}
    >
      <PinInput.Label>Host pin</PinInput.Label>
      <PinInput.Control class="flex w-2 gap-2">
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
