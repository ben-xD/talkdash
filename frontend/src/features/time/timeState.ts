import { createSignal } from "solid-js";
import { DateTime } from "luxon";
import { createStore } from "solid-js/store";
import { trpc } from "../../client/trpc";

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
  console.count("setTimeAction");
  // add to undo stack whenever a change is made so we can undo it.
  if (addToUndoStack) {
    console.debug("Adding to undo stack");
    setUndoStack([...undoStack, action]);
  }
  setFinishTime(action.finishTime);
  setStartTime(action.startTime);
  setTextInputDurationInMinutes(action.userTalkLengthInput);

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
