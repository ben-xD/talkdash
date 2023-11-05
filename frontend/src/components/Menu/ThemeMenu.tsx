import { Menu } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { setTheme, theme, Theme } from "../../css/theme.ts";
import { MenuTypography } from "./MenuTypography.tsx";
import { cn } from "../../css/tailwind.ts";

export const ThemeMenu = () => {
  return (
    <Menu>
      <MenuTypography>
        <Menu.TriggerItem>
          <div class="flex w-full justify-between px-4 py-2">
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
                  "font-bold text-blue-500": theme() === Theme.System,
                })}
                onClick={() => setTheme(Theme.System)}
                id="system"
              >
                System
              </Menu.Item>
              <Menu.Item
                class={cn("px-4 py-2", {
                  "font-bold text-blue-500": theme() === Theme.Dark,
                })}
                onClick={() => setTheme(Theme.Dark)}
                id="dark"
              >
                Dark
              </Menu.Item>
              <Menu.Item
                class={cn("px-4 py-2", {
                  "font-bold text-blue-500": theme() === Theme.Light,
                })}
                onClick={() => setTheme(Theme.Light)}
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
