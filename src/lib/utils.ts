import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserSettings } from "@/components/settings/options";
import { defaultSettings } from "@/components/settings/options";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStoredSettings = (): UserSettings => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("userSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  }
  return defaultSettings;
};

export const saveSettings = (settings: UserSettings) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }
};
