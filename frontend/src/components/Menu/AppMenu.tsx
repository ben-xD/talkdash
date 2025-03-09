import {
  Menu,
  MenuContent,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from "@ark-ui/solid";
import { WrenchIcon } from "../../assets/WrenchIcon";
import { Portal } from "solid-js/web";
import { MenuItemLink } from "./MenuItemLink";
import { ThemeMenu } from "./ThemeMenu";
import { Show } from "solid-js";
import { isSignedIn, signOut } from "../../client/trpc.ts";
import { MenuItemButton } from "./MenuItemButton.tsx";
import { ColorSchemeMenu } from "./ColorSchemeMenu.tsx";

// const cookieRegExpMatcher = (cookieName: string) =>
//   new RegExp(`^(.*;)?\\s*${cookieName}\\s*=\\s*[^;]+(.*)?$`);
// https://stackoverflow.com/a/25617724/7365866
// auth_session set by backend/lucia
// example cookie: auth_session=asdasfafa
// const authCookieMatcher = cookieRegExpMatcher("auth_session");
// const hasAuthCookie = () => !!document.cookie.match(authCookieMatcher);

export const AppMenu = () => {
  return (
    <Menu>
      <MenuTrigger aria-label={"Navigation menu"}>
        <WrenchIcon />
      </MenuTrigger>
      <Portal>
        <MenuPositioner class="">
          <MenuContent class="z-30 rounded-lg bg-white shadow-md">
            <MenuItemGroup id="modes">
              {/*Margins/padding don't work on the label 😢 */}
              <MenuItemLink path="/" title={"Home"} exactPath />
              <MenuItemGroupLabel
                for="modes"
                class="px-4 text-sm font-bold uppercase text-slate-500"
              >
                Modes
              </MenuItemGroupLabel>
              <MenuSeparator />
              <MenuItemLink path="/speaker" title={"Speaker"} />
              <MenuItemLink path="/host" title={"Event Host"} />
              <MenuItemLink path="/audience" title={"Audience"} />
              <MenuItemGroupLabel
                for="modes"
                class="px-4 text-sm font-bold uppercase text-slate-500"
              >
                Extras
              </MenuItemGroupLabel>
              <MenuSeparator />
              <MenuItemLink path="/clock" title={"Clock"} />
              <MenuItemLink path="/stopwatch" title={"Stopwatch"} />
              <ThemeMenu />
              <ColorSchemeMenu />
              <MenuItemLink path="/about" title={"About TalkDash"} />
            </MenuItemGroup>
            <MenuItemGroupLabel
              for="modes"
              class="px-4 text-sm font-bold uppercase text-slate-500"
            >
              Account
            </MenuItemGroupLabel>
            <MenuSeparator />
            <Show when={!isSignedIn()}>
              <MenuItemLink path="/sign-in" title={"Sign in"} />
              <MenuItemLink path="/sign-up" title={"Sign up"} />
            </Show>
            <Show when={isSignedIn()}>
              <MenuItemButton title={"Sign out"} onClick={signOut} />
              <MenuItemLink path="/account" title={"Account"} />
            </Show>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </Menu>
  );
};
