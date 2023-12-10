import { createSignal, onCleanup, onMount } from "solid-js";

export const createWindowSizeSignal = () => {
  const [size, setSize] = createSignal({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const handler = () => {
    setSize({ height: window.innerHeight, width: window.innerWidth });
  };

  onMount(() => {
    window.addEventListener("resize", handler);
  });

  onCleanup(() => {
    window.removeEventListener("resize", handler);
  });

  return size;
};
