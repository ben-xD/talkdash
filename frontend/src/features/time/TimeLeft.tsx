import { currentTime, difference, finishTime, Mode } from "./timeState.js";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish) return { formattedDifference: "00:00:00", mode: Mode.Stopped };
  return difference(currentTime(), finish);
};

export const isExceeded = () => timeLeft().mode === Mode.Exceeded;

export const TimeLeft = () => {
  return (
    <p class={`relative text-center ${isExceeded() ? "text-red-50" : ""}`}>
      {isExceeded() ? "-" : ""}
      {timeLeft().formattedDifference}
    </p>
  );
};
