import { makePersisted } from "@solid-primitives/storage";
import { createEffect, createSignal } from "solid-js";
import colors from "tailwindcss/colors";

export const ColorScheme = {
  blue: "blue",
  green: "green",
  purple: "purple",
  indigo: "indigo",
  pink: "pink",
  orange: "orange",
  gray: "gray",
} as const;

type ColorScheme = keyof typeof ColorScheme;

type ColorRoles = {
  primary: keyof typeof colors;
  secondary: keyof typeof colors;
  bg: keyof typeof colors;
};

export const rolesColorsByScheme: Record<keyof typeof ColorScheme, ColorRoles> =
  {
    blue: {
      primary: "sky",
      secondary: "indigo",
      bg: "sky",
    },
    green: {
      primary: "lime",
      secondary: "teal",
      bg: "lime",
    },
    purple: {
      primary: "purple",
      secondary: "violet",
      bg: "purple",
    },
    indigo: {
      primary: "indigo",
      secondary: "rose",
      bg: "indigo",
    },
    pink: {
      primary: "pink",
      secondary: "fuchsia",
      bg: "pink",
    },
    orange: {
      primary: "orange",
      secondary: "amber",
      bg: "orange",
    },
    gray: {
      primary: "gray",
      secondary: "slate",
      bg: "gray",
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
  createSignal<ColorScheme>(ColorScheme.blue),
  { name: "color_scheme" },
);

const [primaryColorInternal, setPrimaryColor] = createSignal<
  string | undefined
>(undefined);
const [secondaryColorInternal, setSecondaryColor] = createSignal<
  string | undefined
>(undefined);
const [bgColorInternal, setBgColor] = createSignal<string | undefined>(
  undefined,
);
export const primaryColor = primaryColorInternal;
export const secondaryColor = secondaryColorInternal;
export const bgColor = bgColorInternal;

createEffect(() => {
  const selectedColorScheme = colorScheme();
  const roleColors = rolesColorsByScheme[selectedColorScheme];
  for (const role of colorRoles) {
    const color = roleColors[role];
    for (const variant of variants) {
      const tailwindColor = colors[color];
      // Edit css variable, as per https://stackoverflow.com/a/41371037/7365866
      document.documentElement.style.setProperty(
        `--${role}-${variant}`,
        tailwindColor[variant],
      );
    }
  }

  const primaryTailwindColor = colors[roleColors.primary];
  setPrimaryColor(primaryTailwindColor[500]);
  const secondaryTailwindColor = colors[roleColors.secondary];
  setSecondaryColor(secondaryTailwindColor[500]);
  const bgTailwindColor = colors[roleColors.bg];
  setBgColor(bgTailwindColor[100]);
});
