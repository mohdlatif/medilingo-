import { Volume2 } from "lucide-react";
import type { TabContentProps } from "@/types/ibm";

export default function HerbalAlternativesTab({
  fdaData,
  handleSpeak,
}: TabContentProps) {
  // This would need to be populated from a different API or data source
  const alternatives = [
    "No herbal alternatives information available at this time.",
    "Please consult with a healthcare provider before considering any alternatives.",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">Herbal Alternatives</h3>
        <button
          onClick={() => handleSpeak(alternatives.join(" "))}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      {alternatives.map((text, index) => (
        <p key={index} className="text-gray-700">
          {text}
        </p>
      ))}
    </div>
  );
}
