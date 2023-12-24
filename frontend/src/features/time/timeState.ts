import { createEffect, createMemo, createSignal, untrack } from "solid-js";
import { DateTime, Duration } from "luxon";
import { createStore, produce } from "solid-js/store";
import { trpc } from "../../client/trpc";
import { addMessage } from "../messages/receivedMessages.tsx";
import { durationToHuman } from "./luxonUtilities.ts";

export const [textInputDurationInMinutes, setTextInputDurationInMinutes] =
  createSignal("");

export const [finishTime, setFinishTime] = createSignal<DateTime | undefined>(
  undefined,
);
export const [startTime, setStartTime] = createSignal<DateTime | undefined>(
  undefined,
);
export const [currentTime, setCurrentTime] = createSignal<DateTime>(
  DateTime.now(),
);

const [wakeLockSentinel, setWakeLockSentinel] =
  createSignal<WakeLockSentinel>();
const requestWakeLock = async () => {
  if ("wakeLock" in navigator) {
    try {
      const wakeLockSentinel = await navigator.wakeLock.request("screen");
      setWakeLockSentinel(wakeLockSentinel);
    } catch (err) {
      // e.g. system related (low battery)
      console.error(err);
    }
  } else {
    // This feature is in nightly on firefox, so it's not available on normal desktop firefox.
    console.warn(
      "Browser doesn't support wakelocks, consider using an app like Amphetamine to prevent the computer from going to sleep.",
    );
  }
};

const releaseWakeLock = async () => {
  await wakeLockSentinel()?.release();
  setWakeLockSentinel(undefined);
};

// Update servers whenever startTime or finishTime changes.
export const updateServerTimeState = async () => {
  const start = startTime()?.toMillis();
  const finish = finishTime()?.toMillis();
  await trpc.speaker.updateTimes.mutate({
    start,
    finish,
  });
};

export type TimeAction =
  | {
      userTalkLengthInput: string;
      startTime: DateTime;
      finishTime: DateTime;
    }
  | {
      userTalkLengthInput: string;
      startTime: undefined;
      finishTime: undefined;
    };

export const [undoStack, setUndoStack] = createStore<TimeAction[]>([]);
export const [redoStack, setRedoStack] = createStore<TimeAction[]>([]);

export const resetHistory = () => {
  setFinishTime(undefined);
  setStartTime(undefined);
  setUndoStack([]);
  setRedoStack([]);
};

export const setTimeAction = async (
  action: TimeAction,
  clearRedoStack = false,
  addToUndoStack = true,
) => {
  resetNotificationsShown();
  console.count("setTimeAction");
  // add to undo stack whenever a change is made so we can undo it.
  if (addToUndoStack) {
    console.debug("Adding to undo stack");
    setUndoStack([...undoStack, action]);
  }
  setFinishTime(action.finishTime);
  setStartTime(action.startTime);
  setTextInputDurationInMinutes(action.userTalkLengthInput);
  if (action.finishTime) {
    await requestWakeLock();
  } else {
    await releaseWakeLock();
  }

  if (clearRedoStack) {
    // The user performs an action after undoing, so we should clear the
    // redo stack so they can't redo something after their new action.
    console.debug("Clearing redo stack");
    setRedoStack([]);
  }
  await updateServerTimeState();
};

export const undo = async () => {
  // Pop the last undo and put it in redo.
  // Play the last action after that.
  const actionToUndo = undoStack.slice(-1).at(0);
  setUndoStack([...undoStack.slice(0, -1)]);
  const lastAction = undoStack.at(undoStack.length - 1);
  if (actionToUndo) {
    setUndoStack(undoStack);
    setRedoStack([...redoStack, actionToUndo]);
    if (lastAction) {
      await setTimeAction(lastAction, false, false);
    } else {
      await setTimeAction(
        {
          finishTime: undefined,
          startTime: undefined,
          userTalkLengthInput: "",
        },
        false,
        false,
      );
    }
  }
};

export const redo = async () => {
  // pop from redo stack.
  const actionToRedo = redoStack.slice(-1).at(0);
  setRedoStack([...redoStack.slice(0, -1)]);
  if (actionToRedo) {
    setTextInputDurationInMinutes(actionToRedo.userTalkLengthInput);
    setRedoStack([...redoStack]);
    await setTimeAction(actionToRedo);
  }
};

export const difference = (start: DateTime, finish: DateTime) => {
  const isExceeded = finish < start;
  const difference = isExceeded ? start.diff(finish) : finish.diff(start);
  const formattedDifference = difference.toFormat("hh:mm:ss");
  return {
    mode: isExceeded ? Mode.Exceeded : Mode.Running,
    formattedDifference,
    difference,
  };
};

export enum Mode {
  Stopped,
  Running,
  Exceeded,
}

export const elapsedTime = () => {
  const start = startTime();
  if (!start)
    return {
      formattedDifference: "00:00:00",
      mode: Mode.Stopped,
      difference: Duration.fromMillis(0),
    };
  return difference(start, currentTime());
};

export const timeLeft = () => {
  const finish = finishTime();
  if (!finish) {
    return {
      formattedDifference: "00:00:00",
      mode: Mode.Stopped,
      difference: Duration.fromMillis(0),
    };
  }
  return difference(currentTime(), finish);
};

// Defaults to 30 seconds, 5 minutes and 15 minutes.
const defaultNotificationTimesInS: NotificationTimeLeftInS[] = [
  0,
  60 / 2,
  60 * 5,
  60 * 15,
];
const defaultNotificationTimesToNotified = defaultNotificationTimesInS.reduce(
  (acc, time) => ({ ...acc, [time]: false }),
  {},
);
// For testing
// const defaultNotificationTimesToNotified = { 5: false };

type Notified = boolean;
type NotificationTimeLeftInS = number;
const [
  notificationTimeLeftInSToNotified,
  setNotificationTimeLeftInSToNotified,
] = createStore<Record<NotificationTimeLeftInS, Notified>>(
  defaultNotificationTimesToNotified,
);

export const resetNotificationsShown = () => {
  const allFalse = Object.entries(notificationTimeLeftInSToNotified).reduce(
    (acc, [key]) => ({ [key]: false, ...acc }),
    {},
  );
  setNotificationTimeLeftInSToNotified(allFalse);
};

export const resetNotificationTimes = () => {
  setNotificationTimeLeftInSToNotified(defaultNotificationTimesToNotified);
};

createEffect(() => {
  const { mode, difference } = timeLeft();
  const notificationTimes = untrack(() => notificationTimeLeftInSToNotified);
  const seconds = Math.round(difference.toMillis() / 1000);
  if (
    seconds in notificationTimes &&
    !notificationTimes[seconds] &&
    mode === Mode.Running
  ) {
    sendNotificationToUser(seconds);
    setNotificationTimeLeftInSToNotified(
      produce((state) => {
        state[seconds] = true;
      }),
    );
  }
});

const sendNotificationToUser = (seconds: number) => {
  const elapsedTimeText = durationToHuman(elapsedTime().difference);
  if (seconds == 0) {
    addMessage({
      message: `Time's up! That was ${elapsedTimeText}`,
      emojiMessage: "🤖🚨️",
      sender: { role: "bot", username: "TalkDash" },
    });
  } else {
    const durationLeftText = durationToHuman(
      Duration.fromMillis(seconds * 1000),
    );
    addMessage({
      message: `You have ${durationLeftText} left`,
      emojiMessage: "🤖🚨️",
      sender: { role: "bot", username: "TalkDash" },
    });
  }
};

export const isTimeLeft = createMemo(() => timeLeft().mode === Mode.Running);

export const isExceeded = createMemo(() => timeLeft().mode === Mode.Exceeded);
