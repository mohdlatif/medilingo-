import { Tab, TabList, TabPanel, TabPanels, TabGroup } from "@headlessui/react";
import { Volume2, AlertTriangle, Info, Leaf, Pill } from "lucide-react";
import OverviewTab from "./OverviewTab";
import IngredientsTab from "./IngredientsTab";
import SideEffectsTab from "./SideEffectsTab";
import HerbalAlternativesTab from "./HerbalAlternativesTab";
import type { MedicineInfoProps } from "@/types/ibm";

export default function MedicineInfo({
  selectedMedicine,
  imgAnalyzed,
  fdaData,
  sideEffectData, // This contains both sideEffects and herbalAlternatives
  handleSpeak,
  isLoading,
}: MedicineInfoProps) {
  const tabs = [
    { name: "Overview", icon: Info },
    { name: "Ingredients", icon: Pill },
    { name: "Side Effects", icon: AlertTriangle },
    { name: "Herbal Alternatives", icon: Leaf },
  ];

  return (
    <div className="mt-6">
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-emerald-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${
                  selected
                    ? "bg-white text-emerald-700 shadow"
                    : "text-gray-600 hover:bg-white/[0.12] hover:text-emerald-600"
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-4">
          <TabPanel>
            <OverviewTab
              fdaData={fdaData}
              handleSpeak={handleSpeak}
              isLoading={isLoading}
              sideEffectData={sideEffectData}
            />
          </TabPanel>
          <TabPanel>
            <IngredientsTab
              fdaData={fdaData}
              handleSpeak={handleSpeak}
              isLoading={isLoading}
              sideEffectData={sideEffectData}
            />
          </TabPanel>
          <TabPanel>
            <SideEffectsTab
              sideEffectData={sideEffectData?.data?.sideEffects}
              fdaData={fdaData}
              handleSpeak={handleSpeak}
              isLoading={isLoading}
            />
          </TabPanel>
          <TabPanel>
            <HerbalAlternativesTab
              fdaData={fdaData}
              herbalData={sideEffectData?.data?.herbalAlternatives}
              sideEffectData={sideEffectData}
              handleSpeak={handleSpeak}
              isLoading={isLoading}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
