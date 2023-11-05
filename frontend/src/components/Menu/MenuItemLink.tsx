import { MenuItem } from "@ark-ui/solid";
import { A } from "@solidjs/router";
import { MenuItemProps } from "@ark-ui/solid";
import { MenuTypography } from "./MenuTypography.tsx";

export const MenuItemLink = (
  props: { title: string; path: string; exactPath?: boolean } & Omit<
    MenuItemProps,
    "id"
  >,
) => {
  return (
    <MenuTypography>
      <MenuItem class="px-4 py-2" {...props} id={props.title}>
        <A
          end={props.exactPath}
          href={props.path}
          activeClass="text-blue-500 font-bold"
        >
          {props.title}
        </A>
      </MenuItem>
    </MenuTypography>
  );
};
