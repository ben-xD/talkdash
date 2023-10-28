import { currentTime, difference, finishTime, Mode } from "./timeState.js";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish) return { formattedDifference: "00:00:00", mode: Mode.Stopped };
  return difference(currentTime(), finish);
};

export const isExceeded = () => timeLeft().mode === Mode.Exceeded;

export const TimeLeftDisplay = () => {
  return (
    <div class="leading-[18vw] px-8 rounded-lg z-0">
      {isExceeded() ? (
        <p class="text-[14vw] md:max-xl:text-[18vw] text-center tracking-tight text-red-50 rounded-3xl relative">
          -{timeLeft().formattedDifference}
        </p>
      ) : (
        <p class="text-[14vw] md:max-xl:text-[20vw] text-center tracking-tight  select-none relative">
          {timeLeft().formattedDifference}
        </p>
      )}
    </div>
  );
};
