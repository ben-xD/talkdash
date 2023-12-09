import { makePersisted } from "@solid-primitives/storage";
import { createEffect, createSignal } from "solid-js";
import colors from "tailwindcss/colors";

export const ColorScheme = {
  blue: "blue",
  green: "green",
  purple: "purple",
} as const;

type ColorScheme = keyof typeof ColorScheme;

type ColorRoles = {
  primary: keyof typeof colors;
  secondary: keyof typeof colors;
  bg: keyof typeof colors;
};

export const colorRolesByColorScheme: Record<
  keyof typeof ColorScheme,
  ColorRoles
> = {
  blue: {
    primary: "sky",
    secondary: "cyan",
    bg: "indigo",
  },
  green: {
    primary: "lime",
    secondary: "teal",
    bg: "lime",
  },
  purple: {
    primary: "indigo",
    secondary: "rose",
    bg: "indigo",
  },
} as const;

// we don't destructure because makePersisted wants the entire signal
// eslint-disable-next-line solid/reactivity
export const [colorScheme, setColorScheme] = makePersisted(
  // When changing this,we should also update the default colors in css variables
  createSignal<ColorScheme>(ColorScheme.blue),
  { name: "color_scheme" },
);

createEffect(() => {
  const selectedColorScheme = colorScheme();
  const colorRoles = ["primary", "secondary", "bg"] as const;
  const variants = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ] as const;

  const colorRoleColors = colorRolesByColorScheme[selectedColorScheme];
  for (const role of colorRoles) {
    const colorRole = colorRoleColors[role];
    for (const variant of variants) {
      const tailwindColor = colors[colorRole];
      document.documentElement.style.setProperty(
        `--${role}-${variant}`,
        tailwindColor[variant],
      );
    }
  }
});
