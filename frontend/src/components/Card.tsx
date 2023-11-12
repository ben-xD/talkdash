import { JSX } from "solid-js";
import { ClassValue } from "clsx";
import { cn } from "../css/tailwind.ts";

export const Card = (props: { children?: JSX.Element; class?: ClassValue }) => {
  return (
    <div class={cn("z-10 h-full rounded-xl bg-blue-50 shadow-lg", props.class)}>
      <div class="flex h-full flex-col items-stretch justify-between gap-8 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {props.children}
      </div>
    </div>
  );
};
