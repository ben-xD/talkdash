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

export const [colorScheme, setColorScheme] = makePersisted(
  // eslint-disable-next-line solid/reactivity
  createSignal<ColorScheme>(ColorScheme.purple),
  { name: "color_scheme" },
);

createEffect(() => {
  const selectedColorScheme = colorScheme();
  const colorRoleColors = colorRolesByColorScheme[selectedColorScheme];
  for (const role of colorRoles) {
    const colorRole = colorRoleColors[role];
    for (const variant of variants) {
      const tailwindColor = colors[colorRole];
      // Edit css variable, as per https://stackoverflow.com/a/41371037/7365866
      document.documentElement.style.setProperty(
        `--${role}-${variant}`,
        tailwindColor[variant],
      );
    }
  }
});
