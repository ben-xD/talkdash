// Adapted from https://github.com/moment/luxon/issues/1134#issuecomment-1668033880
import { Duration, DurationObjectUnits } from "luxon";

export const durationToHuman = (duration: Duration): string => {
  const durationObj = duration
    .shiftTo("days", "hours", "minutes", "seconds")
    .toObject();

  if ("seconds" in durationObj) {
    durationObj.seconds = Math.round(durationObj.seconds!);
  }

  const cleanedDuration = Object.fromEntries(
    Object.entries(durationObj)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => [key, Math.abs(value)]),
  ) as DurationObjectUnits;

  if (Object.keys(cleanedDuration).length === 0) {
    cleanedDuration.seconds = 0;
  }

  return Duration.fromObject(cleanedDuration).toHuman();
};
