import { onMount } from "solid-js";

const Host = () => {
  onMount(() => {
    document.title = "Host · Talkdash";
  });
  return <p>Host Page</p>;
};

export default Host;
