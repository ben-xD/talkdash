import { createSignal } from "solid-js";
import { DateTime } from "luxon";

export const [finishTime, setFinishTime] = createSignal<DateTime | undefined>(
  undefined,
);
export const [startTime, setStartTime] = createSignal<DateTime | undefined>(
  undefined,
);
export const [currentTime, setCurrentTime] = createSignal<DateTime>(
  DateTime.now(),
);

export const difference = (start: DateTime, finish: DateTime) => {
  const isExceeded = finish < start;
  const difference = isExceeded ? start.diff(finish) : finish.diff(start);
  const differenceSmh = difference
    .shiftTo("seconds", "minutes", "hours")
    .toObject();
  return {
    mode: isExceeded ? Mode.Exceeded : Mode.Running,
    seconds: Math.round(differenceSmh.seconds as number)
      .toString()
      .padStart(2, "0"),
    minutes: (differenceSmh.minutes as number).toString().padStart(2, "0"),
    hours: (differenceSmh.hours as number).toString().padStart(2, "0"),
  };
};

export enum Mode {
  Stopped,
  Running,
  Exceeded,
}
