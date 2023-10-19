import {createSignal} from "solid-js";
import {DateTime} from "luxon";

export const [finishTime, setFinishTime] = createSignal<DateTime | undefined>(undefined);
export const [startTime, setStartTime] = createSignal<DateTime | undefined>(undefined);
export const [currentTime, setCurrentTime] = createSignal<DateTime>(DateTime.now());

export const difference = (start: DateTime, finish: DateTime) => {
  const difference = finish.diff(start);
  const differenceSmh = difference.shiftTo('seconds', 'minutes', 'hours').toObject();
  return {
    seconds: Math.round(differenceSmh.seconds as number).toString().padStart(2, '0'),
    minutes: (differenceSmh.minutes as number).toString().padStart(2, '0'),
    hours: (differenceSmh.hours as number).toString().padStart(2, '0'),
  }
}
