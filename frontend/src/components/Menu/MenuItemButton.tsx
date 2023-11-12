import { MenuItem, MenuItemProps } from "@ark-ui/solid";
import { MenuTypography } from "./MenuTypography.tsx";

export const MenuItemButton = (
  props: { title: string; onClick: () => void } & Omit<MenuItemProps, "id">,
) => {
  return (
    <MenuTypography>
      <MenuItem class="px-4 py-2" {...props} id={props.title}>
        {props.title}
      </MenuItem>
    </MenuTypography>
  );
};
