import { Menu } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { setUserSelectedTheme, theme } from "../../css/theme";
import { MenuTypography } from "./MenuTypography";
import { cn } from "../../css/tailwind";

export const ThemeMenu = () => {
  return (
    <Menu>
      <MenuTypography>
        <Menu.TriggerItem>
          <div class="flex w-full justify-between px-4 py-2 hover:cursor-pointer">
            <p>Theme</p>
            <p>&gt;</p>
          </div>
        </Menu.TriggerItem>
      </MenuTypography>
      <Portal>
        <Menu.Positioner>
          <Menu.Content class="z-30 rounded-lg bg-white shadow-md">
            <MenuTypography>
              {/*TODO use MenuItemButton with "active" prop?*/}
              <Menu.Item
                class={cn("cursor-pointer px-4 py-2", {
                  "font-bold text-primary-500": theme() === "system",
                })}
                onClick={() => setUserSelectedTheme("system")}
                id="system"
              >
                System
              </Menu.Item>
              <Menu.Item
                class={cn("cursor-pointer px-4 py-2", {
                  "font-bold text-primary-500": theme() === "dark",
                })}
                onClick={() => setUserSelectedTheme("dark")}
                id="dark"
              >
                Dark
              </Menu.Item>
              <Menu.Item
                class={cn("cursor-pointer px-4 py-2", {
                  "font-bold text-primary-500": theme() === "light",
                })}
                onClick={() => setUserSelectedTheme("light")}
                id="light"
              >
                Light
              </Menu.Item>
            </MenuTypography>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu>
  );
};
