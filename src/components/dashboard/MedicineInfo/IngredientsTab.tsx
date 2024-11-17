import { Volume2 } from "lucide-react";
import type { TabContentProps } from "@/types/ibm";
import TabSkeleton from "./TabSkeleton";

export default function IngredientsTab({
  fdaData,
  handleSpeak,
  isLoading,
}: TabContentProps) {
  if (isLoading) {
    return <TabSkeleton />;
  }

  const StructuredProductLabeling =
    fdaData?.data.results?.[0]?.spl_product_data_elements?.[0];

  const activeIngredients = fdaData?.data.results?.[0]?.active_ingredient?.[0];
  const inactiveIngredients =
    fdaData?.data.results?.[0]?.inactive_ingredient?.[0];

  const hasAnyIngredients =
    activeIngredients || inactiveIngredients || StructuredProductLabeling;

  if (!hasAnyIngredients) {
    return (
      <div className="text-gray-500">No ingredients information available.</div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Ingredients</h3>
        </div>
      </section>

      <section className="space-y-4">
        {activeIngredients && (
          <div>
            <h4 className="font-medium mb-2">Active Ingredients:</h4>
            <p className="text-sm">
              {Array.isArray(activeIngredients)
                ? activeIngredients.join(", ")
                : activeIngredients}
            </p>
          </div>
        )}

        {inactiveIngredients && (
          <div>
            <h4 className="font-medium mb-2">Inactive Ingredients:</h4>
            <p className="text-sm">
              {Array.isArray(inactiveIngredients)
                ? inactiveIngredients.join(", ")
                : inactiveIngredients}
            </p>
          </div>
        )}

        {StructuredProductLabeling && (
          <div>
            <h4 className="font-medium mb-2">Structured Product Labeling:</h4>
            <p className="text-sm">{StructuredProductLabeling}</p>
          </div>
        )}
      </section>
    </div>
  );
}
