import {
  Editable,
  EditableArea,
  EditableCancelTrigger,
  EditableControl,
  EditableEditTrigger,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmitTrigger,
} from "@ark-ui/solid";
import { CheckIcon } from "../../assets/CheckIcon";
import { XIcon } from "../../assets/XIcon";
import { PencilIcon } from "../../assets/PencilIcon";

type Props = {
  label: string;
  value: () => string | undefined;
  setValue: (value: string) => void;
};

export const EditableStateField = (props: Props) => {
  return (
    <Editable
      placeholder={`No ${props.label.toLowerCase()}`}
      value={props.value()}
      onSubmit={({ value }) => props.setValue(value)}
    >
      {(state) => (
        <>
          <div class="flex justify-between">
            <EditableLabel class="font-bold tracking-tight">
              {props.label}
            </EditableLabel>
            <EditableControl>
              {state().isEditing ? (
                <>
                  <EditableSubmitTrigger class="hover:text-blue-100 active:text-white">
                    <CheckIcon />
                  </EditableSubmitTrigger>
                  <EditableCancelTrigger class="hover:text-blue-100 active:text-white">
                    <XIcon />
                  </EditableCancelTrigger>
                </>
              ) : (
                <EditableEditTrigger
                  aria-label="Edit"
                  class="hover:text-blue-100 active:text-white"
                >
                  <PencilIcon />
                </EditableEditTrigger>
              )}
            </EditableControl>
          </div>
          <EditableArea>
            <EditableInput class="w-full text-blue-600" value={props.value()} />
            <EditablePreview />
          </EditableArea>
        </>
      )}
    </Editable>
  );
};
