import { Menu } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { MenuTypography } from "./MenuTypography";
import { cn } from "../../css/tailwind";
import { For } from "solid-js";
import { colorScheme, ColorScheme, setColorScheme } from "../../css/colors.ts";

export const ColorSchemeMenu = () => {
  return (
    <Menu>
      <MenuTypography>
        <Menu.TriggerItem>
          <div class="flex w-full justify-between px-4 py-2 hover:cursor-pointer">
            <p>Color</p>
            <p>&gt;</p>
          </div>
        </Menu.TriggerItem>
      </MenuTypography>
      <Portal>
        <Menu.Positioner>
          <Menu.Content class="z-30 rounded-lg bg-white shadow-md">
            <For each={Object.entries(ColorScheme)}>
              {([key, value]) => (
                <MenuTypography>
                  <Menu.Item
                    class={cn("cursor-pointer px-4 py-2", {
                      "font-bold text-primary-500": colorScheme() === value,
                    })}
                    onClick={() => setColorScheme(value)}
                    id={value}
                  >
                    {key}
                  </Menu.Item>
                </MenuTypography>
              )}
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu>
  );
};
