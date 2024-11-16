import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserSettings } from "@/components/settings/options";
import { defaultSettings } from "@/components/settings/options";
import { clarityLevels } from "@/components/settings/options";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStoredSettings = (): UserSettings => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.language || !parsed.language.id || !parsed.language.name) {
          parsed.language = defaultSettings.language;
        }
        if (!parsed.clarity || !parsed.clarity.id) {
          parsed.clarity = defaultSettings.clarity;
        } else {
          const matchingClarity = clarityLevels.find(
            (level) => level.id === parsed.clarity.id
          );
          parsed.clarity = matchingClarity || defaultSettings.clarity;
        }
        return parsed;
      }
    } catch (error) {
      console.error("Error parsing stored settings:", error);
    }
  }
  return defaultSettings;
};

export const saveSettings = (settings: UserSettings) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }
};
