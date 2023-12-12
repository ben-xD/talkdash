import { Tooltip } from "@ark-ui/solid";
import { cn } from "../css/tailwind.ts";
import { JSX, Show } from "solid-js";

export const Toggle = (
  props: {
    disabledTooltip?: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
  } & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <Tooltip.Root lazyMount unmountOnExit>
      <Tooltip.Trigger>
        <button
          class={cn(
            "relative inline-flex h-6 w-11 cursor-pointer rounded-full border-[2px] border-transparent bg-opacity-100 transition-all duration-200 ease-in-out focus:ring focus:ring-primary-500",
            {
              "bg-primary-500": props.checked,
              "bg-primary-800": !props.checked,
              "cursor-default": props.disabled,
            },
          )}
          role="switch"
          type="button"
          aria-checked={props.checked}
          onClick={() => props.setChecked(!props.checked)}
          {...props}
        >
          <span class="absolute m-[-1px] h-[1px] w-[1px] shrink-0 overflow-hidden whitespace-nowrap border-0 p-0">
            {props["aria-label"]}
          </span>
          <span
            aria-hidden="true"
            class={cn(
              "h-5 w-5 rounded-full transition-all duration-200 ease-in-out disabled:bg-red-500",
              {
                "translate-x-0": !props.checked,
                "translate-x-5": props.checked,
                "bg-primary-50": !props.disabled,
                "bg-primary-700": props.disabled,
              },
            )}
          />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Show when={props.disabled}>
          <Tooltip.Content class="z-30 max-w-sm flex-wrap rounded-lg bg-primary-50 px-4 py-2 text-primary-800 dark:bg-primary-800 dark:text-primary-200">
            <p class="break-normal">{props.disabledTooltip}</p>
          </Tooltip.Content>
        </Show>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};
