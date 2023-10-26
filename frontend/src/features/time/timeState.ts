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
  const formattedDifference = difference.toFormat("hh:mm:ss");
  return {
    mode: isExceeded ? Mode.Exceeded : Mode.Running,
    formattedDifference,
  };
};

export enum Mode {
  Stopped,
  Running,
  Exceeded,
}
