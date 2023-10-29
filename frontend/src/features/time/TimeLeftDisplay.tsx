import { currentTime, difference, finishTime, Mode } from "./timeState.js";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish) return { formattedDifference: "00:00:00", mode: Mode.Stopped };
  return difference(currentTime(), finish);
};

export const isExceeded = () => timeLeft().mode === Mode.Exceeded;

export const TimeLeftDisplay = () => {
  return (
    <div class="z-0 rounded-lg px-8 leading-[18vw]">
      {isExceeded() ? (
        <h2 class="relative rounded-3xl text-center text-[14vw] tracking-tight text-red-50 md:max-xl:text-[18vw]">
          -{timeLeft().formattedDifference}
        </h2>
      ) : (
        <h2 class="relative select-none text-center text-[14vw]  tracking-tight md:max-xl:text-[20vw]">
          {timeLeft().formattedDifference}
        </h2>
      )}
    </div>
  );
};
