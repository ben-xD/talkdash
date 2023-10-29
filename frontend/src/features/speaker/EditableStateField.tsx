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
import { CheckIcon } from "../../assets/CheckIcon.tsx";
import { XIcon } from "../../assets/XIcon.tsx";
import { PencilIcon } from "../../assets/PencilIcon.tsx";

type Props = {
  label: string;
  value: () => string | undefined;
  setValue: (value: string) => void;
};

export const EditableStateField = ({ label, value, setValue }: Props) => {
  return (
    <Editable
      placeholder={`No ${label.toLowerCase()}`}
      value={value()}
      onSubmit={({ value }) => setValue(value)}
    >
      {(state) => (
        <>
          <div class="flex justify-between">
            <EditableLabel class="font-bold tracking-tight">
              {label}
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
                <EditableEditTrigger class="hover:text-blue-100 active:text-white">
                  <PencilIcon />
                </EditableEditTrigger>
              )}
            </EditableControl>
          </div>
          <EditableArea>
            <EditableInput class="w-full text-blue-600" value={value()} />
            <EditablePreview />
          </EditableArea>
        </>
      )}
    </Editable>
  );
};
