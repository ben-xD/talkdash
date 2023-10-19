import {currentTime, difference, finishTime} from "./timeState.ts";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish)  return {seconds: '00', minutes: '00', hours: '00'};
  return difference(currentTime(), finish)
}

export const TimeLeftDisplay = () => {
  return <div class='bg-indigo-100 px-24 rounded-full'>
    <p class='text-[20vw] text-center'>{timeLeft().hours}:{timeLeft().minutes}:{timeLeft().seconds}</p>
  </div>
}