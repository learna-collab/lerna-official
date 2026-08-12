import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LESSON_DAYS = [
  { label: "Monday", value: "Day 1" },
  { label: "Tuesday", value: "Day 2" },
  { label: "Wednesday", value: "Day 3" },
  { label: "Thursday", value: "Day 4" },
  { label: "Friday", value: "Day 5" },
];

export function getDayLabel(value: string) {
  return LESSON_DAYS.find((d) => d.value === value)?.label ?? value;
}
