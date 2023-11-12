import { MenuItem, MenuItemProps } from "@ark-ui/solid";
import { MenuTypography } from "./MenuTypography";

export const MenuItemButton = (
  props: { title: string; onClick: () => void } & Omit<MenuItemProps, "id">,
) => {
  return (
    <MenuTypography class="hover:cursor-pointer">
      <MenuItem class="px-4 py-2" {...props} id={props.title}>
        {props.title}
      </MenuItem>
    </MenuTypography>
  );
};
