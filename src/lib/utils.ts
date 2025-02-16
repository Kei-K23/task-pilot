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

export function extractNameFromEmail(email: string): string {
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }

  const namePart = email.split("@")[0]; // Get the part before '@'

  // Replace common separators with spaces and capitalize words
  return namePart
    .replace(/[\.\_\-]/g, " ") // Replace dots, underscores, and hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}
