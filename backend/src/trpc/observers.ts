import { Observer } from "@trpc/server/observable";

export const emitToAll = <T extends object>(
  observers: Set<Observer<T, Error>> | undefined,
  event: T,
) => {
  if (observers) {
    console.debug(`Sending event: ${JSON.stringify(event)}`);
    for (const observer of observers) {
      observer.next(event);
    }
  }
};
