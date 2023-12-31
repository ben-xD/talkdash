import { JSX } from "solid-js";
import { ClassValue } from "clsx";
import { cn } from "../css/tailwind";

export const Card = (props: { children?: JSX.Element; class?: ClassValue }) => {
  return (
    <div
      class={cn(
        "h-full rounded-xl bg-primary-50 text-primary-800 shadow-lg dark:bg-primary-900 dark:text-primary-200",
        props.class,
      )}
    >
      <div class="flex h-full flex-col items-stretch justify-between gap-8">
        {props.children}
      </div>
    </div>
  );
};
