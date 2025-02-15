import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomCharacters(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let index = 0; index < length; index++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateRandomColor(): string {
  const colors = [
    "#1ABC9C",
    "#FF5733",
    "#9B59B6",
    "#3498DB",
    "#E74C3C",
    "#F39C12",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function formatEnumCase(input: string): string {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning!";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon!";
  } else if (hour >= 18 && hour < 22) {
    return "Good evening!";
  } else {
    return "Good night!";
  }
}
