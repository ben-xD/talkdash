import {currentTime, difference, finishTime} from "./timeState.ts";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish)  return {seconds: '00', minutes: '00', hours: '00'};
  return difference(currentTime(), finish)
}

export const TimeLeftDisplay = () => {
  return <div class=' leading-[19vw] px-8 rounded-lg'>
    <p class='text-[20vw] text-center tracking-tight'>{timeLeft().hours}:{timeLeft().minutes}:{timeLeft().seconds}</p>
  </div>
}
