import { JSX } from "solid-js";
import { cn } from "../../css/tailwind.ts";

export const MenuTypography = (props: {
  children: JSX.Element;
  class?: string;
}) => {
  return (
    <div class={cn("text-slate-700 hover:text-slate-500", props.class)}>
      {props.children}
    </div>
  );
};
