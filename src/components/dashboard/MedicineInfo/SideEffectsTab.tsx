import { Volume2 } from "lucide-react";
import type { TabContentProps } from "@/types/ibm";
import TabSkeleton from "./TabSkeleton";

export default function SideEffectsTab({
  fdaData,
  handleSpeak,
  isLoading,
}: TabContentProps) {
  if (isLoading) {
    return <TabSkeleton />;
  }

  const sideEffects =
    fdaData?.results?.[0]?.adverse_reactions ||
    "No side effects information available";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">Possible Side Effects</h3>
        <button
          onClick={() => handleSpeak(sideEffects)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      <p className="text-gray-700">{sideEffects}</p>
    </div>
  );
}
