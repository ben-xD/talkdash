import {currentTime, difference, finishTime} from "./timeState.ts";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish)  return {seconds: '00', minutes: '00', hours: '00'};
  return difference(currentTime(), finish)
}

export const TimeLeftDisplay = () => {
  return <p class='text-9xl'>{timeLeft().hours}:{timeLeft().minutes}:{timeLeft().seconds}</p>
}