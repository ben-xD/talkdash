import {currentTime, difference, startTime} from "./timeState.ts";

const elapsedTime = () => {
  const start = startTime();
  if (!start) return {seconds: '00', minutes: '00', hours: '00'};
  return difference(start, currentTime())
}

export const ElapsedTime = () => {
  return <p>Elapsed: <span>{elapsedTime().hours}:{elapsedTime().minutes}:{elapsedTime().seconds}</span></p>
}