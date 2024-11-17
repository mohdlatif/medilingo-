import { Volume2 } from "lucide-react";
import type { TabContentProps } from "@/types/ibm";
import TabSkeleton from "./TabSkeleton";

export default function OverviewTab({
  fdaData,
  handleSpeak,
  isLoading,
}: TabContentProps) {
  if (isLoading) {
    return <TabSkeleton />;
  }

  const purposeText = fdaData?.data?.results?.[0]?.purpose?.[0];
  const indicationsText =
    fdaData?.data?.results?.[0]?.indications_and_usage?.[0];
  const warningsText = fdaData?.data?.results?.[0]?.warnings_and_cautions?.[0];
  const patientInfoText =
    fdaData?.data?.results?.[0]?.information_for_patients?.[0];

  const speechText = [
    purposeText && `Purpose: ${purposeText}`,
    indicationsText && `Indications and Usage: ${indicationsText}`,
    warningsText && `Warnings and Cautions: ${warningsText}`,
    patientInfoText && `Information for Patients: ${patientInfoText}`,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          {purposeText && (
            <div>
              <h3 className="font-semibold mb-2">Purpose</h3>
              <p className="text-gray-700">{purposeText}</p>
            </div>
          )}
          {indicationsText && (
            <div>
              <h3 className="font-semibold mb-2">Indications & Usage</h3>
              <p className="text-gray-700">{indicationsText}</p>
            </div>
          )}
          {warningsText && (
            <div>
              <h3 className="font-semibold mb-2">Warnings & Cautions</h3>
              <p className="text-gray-700">{warningsText}</p>
            </div>
          )}
          {patientInfoText && (
            <div>
              <h3 className="font-semibold mb-2">Information for Patients</h3>
              <p className="text-gray-700">{patientInfoText}</p>
            </div>
          )}
        </div>
        {speechText && (
          <button
            onClick={() => handleSpeak(speechText)}
            className="ml-2 p-2 text-gray-500 hover:text-emerald-600 flex-shrink-0"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
