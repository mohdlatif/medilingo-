import { Volume2 } from "lucide-react";
import type { TabContentProps } from "@/types/ibm";

interface HerbalOption {
  name: string;
  benefits: string;
  warnings: string;
}

export default function HerbalAlternativesTab({
  fdaData,
  herbalData,
  handleSpeak,
}: TabContentProps) {
  console.log("herbalData:", herbalData);

  const analysisData = (() => {
    try {
      return typeof herbalData?.analysis === "string"
        ? JSON.parse(herbalData.analysis)
        : herbalData?.analysis || null;
    } catch (error) {
      console.error("Error parsing herbal alternatives data:", error);
      return null;
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">Herbal Alternatives</h3>
        <button
          onClick={() =>
            handleSpeak(
              herbalData.options
                .map(
                  (option: HerbalOption) => `${option.name}: ${option.benefits}`
                )
                .join(". ")
            )
          }
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>

      {herbalData.options.map((option: HerbalOption, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-lg">{option.name}</h4>
          <p className="text-green-600">Benefits: {option.benefits}</p>
          <p className="text-red-600">Warning: {option.warnings}</p>
        </div>
      ))}

      {herbalData.disclaimer && (
        <p className="text-sm text-gray-500 italic mt-4">
          {herbalData.disclaimer}
        </p>
      )}
    </div>
  );
}
