import { JSX } from "solid-js";

export const MenuTypography = (props: { children: JSX.Element }) => {
  return (
    <div class="text-slate-700 hover:text-slate-500">{props.children}</div>
  );
};
