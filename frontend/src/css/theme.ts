import { createSignal } from "solid-js";

// This file is responsible for:
// - allowing users to switch between light/dark/system themes
// - listening for updates to the system theme and updating page without refresh
// - persisting the theme to local storage to remember the user's choice
// - A solid signal for the current theme, to update UI controls
// Significantly adapted on top of https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually

export enum Theme {
  Dark = "dark",
  Light = "light",
  System = "system",
}

const localStorageThemeKey = "theme";

const [internalTheme, setThemeSignal] = createSignal<Theme>();
export const theme = internalTheme;

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
  if (persistedTheme) {
    setThemeSignal(theme);
    updatePageTheme(persistedTheme);
  } else {
    setThemeSignal(Theme.System);
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

// Call it whenever the user changes the theme in the app (not OS/system theme)
export const setTheme = (theme: Theme) => {
  setThemeSignal(theme);
  switch (theme) {
    case Theme.Dark:
      localStorage.theme = "dark";
      updatePageTheme(Theme.Dark);
      break;
    case Theme.Light:
      localStorage.theme = "light";
      updatePageTheme(Theme.Light);
      break;
    case Theme.System:
      localStorage.removeItem(localStorageThemeKey);
      updatePageTheme(getSystemTheme());

      break;
  }
};
