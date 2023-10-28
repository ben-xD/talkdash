import { JSX } from "solid-js";

export const Button = (props: {
  onClick: () => void;
  children?: JSX.Element;
  disabled?: boolean;
  class?: string;
}) => {
  return (
    <button
      type="button"
      disabled={props.disabled}
      class={`${props.class} px-4 py-2 rounded-md disabled:bg-gray-400 shadow uppercase`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
