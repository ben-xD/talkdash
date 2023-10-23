import {currentTime, difference, finishTime, Mode} from "./timeState.ts";

const timeLeft = () => {
  const finish = finishTime();
  if (!finish)  return {seconds: '00', minutes: '00', hours: '00', mode:Mode.Stopped };
  return difference(currentTime(), finish)
}

export const isExceeded = () => timeLeft().mode === Mode.Exceeded;

export const TimeLeftDisplay = () => {

  return <div class='leading-[18vw] px-8 rounded-lg z-0'>
    {isExceeded() ?
    <p class='text-[16vw] md:max-xl:text-[18vw] text-center tracking-tight text-red-50 rounded-3xl relative'>-{timeLeft().hours}:{timeLeft().minutes}:{timeLeft().seconds}</p>
      :
    <p class='text-[16vw] md:max-xl:text-[20vw] text-center tracking-tight  select-none relative'>{timeLeft().hours}:{timeLeft().minutes}:{timeLeft().seconds}</p>
    }
  </div>
}
