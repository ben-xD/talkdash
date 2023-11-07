import { Editable } from "@ark-ui/solid";
import { CheckIcon } from "../../assets/CheckIcon.tsx";
import { XIcon } from "../../assets/XIcon.tsx";
import { PencilIcon } from "../../assets/PencilIcon.tsx";

type Props = {
  label: string;
  value: () => string | undefined;
  setValue: (value: string) => void;
};

export const EditableStateField = (props: Props) => {
  return (
    <Editable.Root
      placeholder={`No ${props.label.toLowerCase()}`}
      value={props.value()}
      onSubmit={({ value }) => props.setValue(value)}
    >
      {(state) => (
        <>
          <div class="flex justify-between">
            <Editable.Label class="font-bold tracking-tight">
              {props.label}
            </Editable.Label>
            <Editable.Control>
              {state().isEditing ? (
                <div class="relative bottom-2 flex gap-2">
                  <Editable.SubmitTrigger class="rounded ring-1 ring-blue-100 hover:text-blue-100 active:text-white">
                    <CheckIcon class="bg-gray-200 bg-opacity-25" />
                  </Editable.SubmitTrigger>
                  <Editable.CancelTrigger class="rounded ring-1 ring-blue-100 hover:text-blue-100 active:text-white">
                    <XIcon class="bg-gray-200 bg-opacity-25" />
                  </Editable.CancelTrigger>
                </div>
              ) : (
                <Editable.EditTrigger
                  aria-label="Edit"
                  class="hover:text-blue-100 active:text-white"
                >
                  <PencilIcon />
                </Editable.EditTrigger>
              )}
            </Editable.Control>
          </div>
          <Editable.Area class="rounded hover:bg-gray-200 hover:bg-opacity-25">
            <Editable.Input
              class="w-full text-blue-600"
              value={props.value()}
            />
            <Editable.Preview />
          </Editable.Area>
        </>
      )}
    </Editable.Root>
  );
};
