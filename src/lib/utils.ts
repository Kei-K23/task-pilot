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
