import { MenuItem } from "@ark-ui/solid";
import { A } from "@solidjs/router";
import { MenuItemProps } from "@ark-ui/solid";
import { MenuTypography } from "./MenuTypography";

export const MenuItemLink = (
  props: {
    title: string;
    path: string;
    exactPath?: boolean;
    closeOnSelect?: boolean;
  } & Omit<MenuItemProps, "id">,
) => {
  return (
    <A
      end={props.exactPath}
      href={props.path}
      activeClass="text-primary-500 font-bold"
    >
      <MenuTypography>
        <MenuItem
          closeOnSelect={props.closeOnSelect}
          class="px-4 py-2"
          {...props}
          id={props.title}
        >
          <p>{props.title}</p>
        </MenuItem>
      </MenuTypography>
    </A>
  );
};
