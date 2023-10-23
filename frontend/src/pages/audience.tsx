import { onMount } from "solid-js";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
  });

  return <p>Audience Page</p>;
};

export default Audience;
