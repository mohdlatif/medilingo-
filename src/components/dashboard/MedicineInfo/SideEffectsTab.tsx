import { Volume2 } from "lucide-react";
import type { TabContentProps } from "@/types/ibm";
import TabSkeleton from "./TabSkeleton";

interface SideEffects {
  common: string[];
  serious: string[];
  rare: string[];
}

export default function SideEffectsTab({
  fdaData,
  sideEffectData,
  handleSpeak,
  isLoading,
}: TabContentProps) {
  if (isLoading) {
    return <TabSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">Side Effects</h3>
        <button
          onClick={() =>
            handleSpeak(
              Object.entries(sideEffectData)
                .map(
                  ([category, effects]) =>
                    `${category} effects include: ${(effects as string[]).join(
                      ", "
                    )}`
                )
                .join(". ")
            )
          }
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>

      {(Object.entries(sideEffectData) as [string, string[]][]).map(
        ([category, effects]) => (
          <div key={category} className="space-y-2">
            <h4
              className={`font-medium ${
                category === "common"
                  ? "text-gray-700"
                  : category === "serious"
                  ? "text-red-600"
                  : "text-orange-600"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} Side
              Effects
            </h4>
            <ul className="list-disc pl-5">
              {effects.map((effect: string, index: number) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
