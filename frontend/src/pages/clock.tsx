import { currentTime } from "../features/time/timeState.ts";

export const ClockPage = () => {
  return (
    <p class="text-[20vw] my-auto md:max-xl:text-[20vw] text-center tracking-tight  select-none relative">
      {currentTime().toFormat("HH:mm:ss")}
    </p>
  );
};
