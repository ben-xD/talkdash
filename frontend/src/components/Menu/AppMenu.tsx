import {
  Menu,
  MenuContent,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from "@ark-ui/solid";
import { WrenchIcon } from "../../assets/WrenchIcon.tsx";
import { Portal } from "solid-js/web";
import { MenuItemLink } from "./MenuItemLink.tsx";
import { ThemeMenu } from "./ThemeMenu.tsx";
import { createSignal, onMount, Show } from "solid-js";

const cookieRegExpMatcher = (cookieName: string) =>
  new RegExp(`^(.*;)?\\s*${cookieName}\\s*=\\s*[^;]+(.*)?$`);
// https://stackoverflow.com/a/25617724/7365866
// auth_session set by backend/lucia
// example cookie: auth_session=asdasfafa
const authCookieMatcher = cookieRegExpMatcher("auth_session");
const hasAuthCookie = () => !!document.cookie.match(authCookieMatcher);

export const AppMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>();

  onMount(() => {
    setIsLoggedIn(hasAuthCookie());
  });

  return (
    <Menu>
      <MenuTrigger aria-label={"Navigation menu"}>
        <WrenchIcon />
      </MenuTrigger>
      <Portal>
        <MenuPositioner class="z-10">
          <MenuContent class="rounded-lg bg-white shadow-md">
            <MenuItemGroup id="modes">
              {/*Margins/padding don't work on the label 😢 */}
              <MenuItemLink path="/" title={"Home"} exactPath />
              <MenuItemGroupLabel
                htmlFor="modes"
                class="px-4 text-sm font-bold uppercase text-slate-500"
              >
                Modes
              </MenuItemGroupLabel>
              <MenuSeparator />
              <MenuItemLink path="/speaker" title={"Speaker"} />
              <MenuItemLink path="/host" title={"Event Host"} />
              <MenuItemLink path="/audience" title={"Audience"} />
              <MenuItemGroupLabel
                htmlFor="modes"
                class="px-4 text-sm font-bold uppercase text-slate-500"
              >
                Extras
              </MenuItemGroupLabel>
              <MenuSeparator />
              <MenuItemLink path="/clock" title={"Clock"} />
              <MenuItemLink path="/stopwatch" title={"Stopwatch"} />
              <ThemeMenu />
            </MenuItemGroup>
            <MenuItemGroupLabel
              htmlFor="modes"
              class="px-4 text-sm font-bold uppercase text-slate-500"
            >
              Account
            </MenuItemGroupLabel>
            <Show when={!isLoggedIn()}>
              <MenuItemLink path="/sign-in" title={"Sign in"} />
              {/*<MenuItemLink path="/sign-up" title={"Sign up"} />*/}
            </Show>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </Menu>
  );
};
