import { Show } from "solid-js";

export const Alert = (props: { message: string | undefined }) => {
  return (
    <Show when={props.message}>
      <div
        class="relative rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong class="font-bold">Error.</strong>
        <span class="block sm:inline"> {props.message}</span>
      </div>
    </Show>
  );
};
