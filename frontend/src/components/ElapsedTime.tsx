import {
  currentTime,
  difference,
  startTime,
} from "../features/time/timeState.ts";

export const elapsedTime = () => {
  const start = startTime();
  if (!start) return { formattedDifference: "00:00:00" };
  return difference(start, currentTime());
};

export const ElapsedTime = () => {
  return (
    <div class="flex gap-2">
      <span class="font-bold">{elapsedTime().formattedDifference}</span>
      <span>elapsed</span>
    </div>
  );
};
