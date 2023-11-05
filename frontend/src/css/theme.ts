import { createSignal } from "solid-js";

// This file is responsible for:
// - allowing users to switch between light/dark/system themes
// - listening for updates to the system theme and updating page without refresh
// - persisting the theme to local storage to remember the user's choice
// - A solid signal for the current theme, to update UI controls
// Significantly adapted on top of https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually

export type Theme = "dark" | "light" | "system";

const localStorageThemeKey = "theme";

const [internalTheme, setThemeSignal] = createSignal<Theme>();
export const theme = () => internalTheme();

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getPersistedTheme = () => {
  return localStorage.getItem(localStorageThemeKey) as "dark" | "light" | null;
};

const updatePageTheme = (theme: "light" | "dark") => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

/// Call it once when loading the page
export const loadThemeOntoPage = () => {
  const persistedTheme = getPersistedTheme();
  // Even though dark and light have the same conditional block,
  // we need to duplicate it because of solid. Otherwise, the signal value is `undefined` instead of
  // the values we pass it (dark or light).
  if (persistedTheme === "dark") {
    setThemeSignal("dark");
    updatePageTheme(persistedTheme);
  } else if (persistedTheme === "light") {
    setThemeSignal("light");
    updatePageTheme(persistedTheme);
  } else {
    setThemeSignal("system");
    updatePageTheme(getSystemTheme());
  }

  // Add listener so we know whenever the user changes their system theme
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const theme = e.matches ? "dark" : "light";
      if (!localStorage.getItem(localStorageThemeKey)) {
        updatePageTheme(theme);
      }
    });
};

// Call it whenever the user changes the theme in the app (not when OS/system theme changes)
export const setUserSelectedTheme = (theme: Theme) => {
  setThemeSignal(theme);
  switch (theme) {
    case "dark":
    case "light":
      localStorage.theme = theme;
      updatePageTheme(theme);
      break;
    case "system":
      localStorage.removeItem(localStorageThemeKey);
      updatePageTheme(getSystemTheme());
      break;
  }
};
