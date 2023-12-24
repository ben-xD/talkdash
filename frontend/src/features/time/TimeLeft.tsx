import { cn } from "../../css/tailwind";
import { isExceeded, timeLeft } from "./timeState.ts";

export const TimeLeft = () => {
  return (
    <p
      class={cn("relative text-center", {
        "text-danger-50 dark:rounded-3xl dark:bg-gradient-to-r dark:from-violet-600 dark:via-violet-300 dark:to-lime-400 dark:bg-clip-text dark:text-transparent":
          isExceeded(),
      })}
    >
      {isExceeded() ? "-" : ""}
      {timeLeft().formattedDifference}
    </p>
  );
};
