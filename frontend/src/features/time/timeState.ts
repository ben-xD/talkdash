import { createSignal } from "solid-js";
import { DateTime } from "luxon";
import { createStore } from "solid-js/store";

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

export const setTimeAction = (
  action: TimeAction,
  clearRedoStack = true,
) => {
  // add to undo stack whenever a change is made so we can undo it.
  setUndoStack([...undoStack, action]);
  setFinishTime(action.finishTime);
  setStartTime(action.startTime);

  if (clearRedoStack) {
    // The user performs an action after undoing, so we should clear the
    // redo stack so they can't redo something after their new action.
    setRedoStack([]);
  }
};

export const undo = () => {
  // Pop the last undo and put it in redo.
  // Play the last action after that.
  const actionToUndo = undoStack.slice(-1).at(0);
  setUndoStack([...undoStack.slice(0, -1)]);
  const lastAction = undoStack.at(undoStack.length - 1);
  if (actionToUndo) {
    setUndoStack(undoStack);
    setRedoStack([...redoStack, actionToUndo]);
    if (lastAction) {
      setTextInputDurationInMinutes(lastAction.userTalkLengthInput);
      setFinishTime(lastAction.finishTime);
      setStartTime(lastAction.startTime);
    } else {
      setFinishTime(undefined);
      setStartTime(undefined);
    }
  }
};

export const redo = () => {
  // pop from redo stack.
  const actionToRedo = redoStack.slice(-1).at(0);
  setRedoStack([...redoStack.slice(0, -1)]);
  if (actionToRedo) {
    setTextInputDurationInMinutes(actionToRedo.userTalkLengthInput);
    setRedoStack([...redoStack]);
    setTimeAction(actionToRedo, false);
  }
};

export const difference = (start: DateTime, finish: DateTime) => {
  const isExceeded = finish < start;
  const difference = isExceeded ? start.diff(finish) : finish.diff(start);
  const formattedDifference = difference.toFormat("hh:mm:ss");
  return {
    mode: isExceeded ? Mode.Exceeded : Mode.Running,
    formattedDifference,
  };
};

export enum Mode {
  Stopped,
  Running,
  Exceeded,
}
