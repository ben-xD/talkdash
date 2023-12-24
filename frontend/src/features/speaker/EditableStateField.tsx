import { Editable } from "@ark-ui/solid";
import { CheckIcon } from "../../assets/CheckIcon";
import { XIcon } from "../../assets/XIcon";
import { PencilIcon } from "../../assets/PencilIcon";

type Props = {
  label: string;
  class?: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled?: boolean;
};

export const EditableStateField = (props: Props) => {
  return (
    <Editable.Root
      class={props.class}
      placeholder={`Not set`}
      value={props.value}
      disabled={props.disabled}
      onValueCommit={(e) => props.setValue(e.value)}
    >
      {(state) => (
        <>
          <div class="flex justify-between">
            <Editable.Label class="font-bold tracking-tight">
              {props.label}
            </Editable.Label>
            <Editable.Control>
              {state().isEditing ? (
                <>
                  <Editable.SubmitTrigger class="hover:text-primary-100 active:text-white">
                    <CheckIcon />
                  </Editable.SubmitTrigger>
                  <Editable.CancelTrigger class="hover:text-primary-100 active:text-white">
                    <XIcon />
                  </Editable.CancelTrigger>
                </>
              ) : (
                <Editable.EditTrigger
                  aria-label="Edit"
                  class="hover:text-primary-100 active:text-white"
                >
                  <PencilIcon />
                </Editable.EditTrigger>
              )}
            </Editable.Control>
          </div>
          <Editable.Area>
            <Editable.Input
              class="w-full text-primary-600"
              value={props.value}
            />
            <Editable.Preview />
          </Editable.Area>
        </>
      )}
    </Editable.Root>
  );
};
