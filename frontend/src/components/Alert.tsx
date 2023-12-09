import { Show } from "solid-js";
import { cn } from "../css/tailwind.ts";

export const Alert = (props: { message?: string; class?: string }) => {
  return (
    <Show when={props.message}>
      <div
        class={cn(
          "relative rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-danger-700",
          props.class,
        )}
        role="alert"
      >
        <strong class="font-bold">Error.</strong>
        <span class="block sm:inline"> {props.message}</span>
      </div>
    </Show>
  );
};
