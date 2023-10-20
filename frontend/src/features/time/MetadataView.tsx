import {currentTime, difference, startTime} from "./timeState.ts";

const elapsedTime = () => {
  const start = startTime();
  if (!start) return {seconds: '00', minutes: '00', hours: '00'};
  return difference(start, currentTime())
}

export const MetadataView = () => {
  return <div class='py-4 my-2 p-4 rounded-xl'>
    <p><span class='font-bold'>Elapsed:</span> <span>{elapsedTime().hours}:{elapsedTime().minutes}:{elapsedTime().seconds}</span></p>
    <p><span class='font-bold'>Identifier: </span>id</p>
    <p><span class='font-bold'>Password: </span>pw</p>
  </div>
}
