import { Menu } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { setUserSelectedTheme, theme } from "../../css/theme";
import { MenuTypography } from "./MenuTypography";
import { cn } from "../../css/tailwind";

export const ThemeMenu = () => {
  return (
    <Menu>
      <Menu.TriggerItem>
        <div class="flex justify-between px-4 py-2 hover:cursor-pointer">
          <MenuTypography>Theme</MenuTypography>
          <MenuTypography>&gt;</MenuTypography>
        </div>
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content class="z-30 rounded-lg bg-white shadow-md">
            <MenuTypography>
              {/*TODO use MenuItemButton with "active" prop?*/}
              <Menu.Item
                closeOnSelect={false}
                class={cn("cursor-pointer px-4 py-2", {
                  "text-primary-500 font-bold": theme() === "system",
                })}
                onClick={() => setUserSelectedTheme("system")}
                id="system"
              >
                <MenuTypography>System</MenuTypography>
              </Menu.Item>
              <Menu.Item
                closeOnSelect={false}
                class={cn("cursor-pointer px-4 py-2", {
                  "text-primary-500 font-bold": theme() === "dark",
                })}
                onClick={() => setUserSelectedTheme("dark")}
                id="dark"
              >
                <MenuTypography>Dark</MenuTypography>
              </Menu.Item>
              <Menu.Item
                closeOnSelect={false}
                class={cn("cursor-pointer px-4 py-2", {
                  "text-primary-500 font-bold": theme() === "light",
                })}
                onClick={() => setUserSelectedTheme("light")}
                id="light"
              >
                <MenuTypography>Light</MenuTypography>
              </Menu.Item>
            </MenuTypography>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu>
  );
};
