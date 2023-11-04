import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// Merges class names, inspired by shadcn/ui.
// See [cn() - Every Tailwind Coder Needs It (clsx + twMerge)](https://www.youtube.com/watch?v=re2JFITR7TI) for an explanation.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
