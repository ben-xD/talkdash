import { elapsedTime } from "../features/time/timeState.ts";

export const ElapsedTime = () => {
  return (
    <div class="flex gap-2">
      <span class="font-bold">{elapsedTime().formattedDifference}</span>
      <span>elapsed</span>
    </div>
  );
};
