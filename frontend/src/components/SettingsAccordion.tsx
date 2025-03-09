import { Accordion } from "@ark-ui/solid";
import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { ChevronDownIcon } from "../assets/ChevronDownIcon.tsx";
import { cn } from "../css/tailwind";
import { showMilliseconds } from "../features/time/timeState";
import { setShowMilliseconds } from "../features/time/timeState.ts";
import { Toggle } from "./Toggle.tsx";

const [accordionState, setAccordionState] = makePersisted(
  createSignal<string[]>([]),
  {
    name: "speaker_config_accordion_state",
  },
);

const isSettingsOpen = () => accordionState().includes("Settings");

export const SettingsAccordion = () => {
  return (
    <Accordion.Root
      value={accordionState()}
      lazyMount={false}
      unmountOnExit={false}
      onValueChange={(details) => setAccordionState(details.value)}
      multiple
    >
      <Accordion.Item value={"Settings"}>
        <Accordion.ItemTrigger class="flex w-full justify-between">
          <p class="font-bold">Settings</p>
          <Accordion.ItemIndicator>
            <ChevronDownIcon
              class={cn("transition-transform", {
                "rotate-180": isSettingsOpen(),
              })}
            />
          </Accordion.ItemIndicator>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent class="transition-all data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
          <div class={"flex flex-col gap-4 py-4"}>
            <div class="flex justify-between">
              <label for="show-milliseconds-enabled">Show milliseconds</label>
              <Toggle
                id="show-milliseconds-enabled"
                aria-label={"Toggle milliseconds"}
                checked={showMilliseconds()}
                setChecked={setShowMilliseconds}
              />
            </div>
          </div>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};
