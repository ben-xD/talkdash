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
          <Menu.Content class="rounded-lg bg-white shadow-md">
            <MenuTypography>
              <Menu.Item
                class={cn("px-4 py-2", {
                  "text-primary-500 font-bold": theme() === "system",
                })}
                onClick={() => setUserSelectedTheme("system")}
                id="system"
              >
                System
              </Menu.Item>
              <Menu.Item
                class={cn("px-4 py-2", {
                  "text-primary-500 font-bold": theme() === "dark",
                })}
                onClick={() => setUserSelectedTheme("dark")}
                id="dark"
              >
                Dark
              </Menu.Item>
              <Menu.Item
                class={cn("px-4 py-2", {
                  "text-primary-500 font-bold": theme() === "light",
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
