import { currentTime, difference, finishTime, Mode } from "./timeState";
import { cn } from "../../css/tailwind";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish) return { formattedDifference: "00:00:00", mode: Mode.Stopped };
  return difference(currentTime(), finish);
};

export const isExceeded = () => timeLeft().mode === Mode.Exceeded;

export const TimeLeft = () => {
  return (
    <p
      class={cn("relative text-center", {
        "text-red-50 dark:rounded-3xl dark:bg-gradient-to-r dark:from-violet-600 dark:via-violet-300 dark:to-lime-400 dark:bg-clip-text dark:text-transparent":
          isExceeded(),
      })}
    >
      {isExceeded() ? "-" : ""}
      {timeLeft().formattedDifference}
    </p>
  );
};
