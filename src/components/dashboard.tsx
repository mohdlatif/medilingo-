import { useState, useEffect } from "react";

import {
  languages,
  clarityLevels,
  type UserSettings,
} from "./settings/options";
import { getStoredSettings, saveSettings } from "@/lib/utils";
import SettingsPanel from "./settings/SettingsPanel";
import ImageUpload from "./ImageUpload";
import { Toaster } from "sonner";
import { showToast } from "@/lib/showToast";
import Header from "@/components/dashboard/Header";
import SearchSection from "@/components/dashboard/SearchSection";
import MedicineInfo from "@/components/dashboard/MedicineInfo";
// Add at the top of the file, after imports
declare global {
  interface Window {
    sendWatsonMessage: (message: string) => Promise<void>;
  }
}

// API utility function
const api_calls = async (
  data: string,
  settings: UserSettings,
  selectedClarity: { id: string; label: string }
) => {
  try {
    // Format user settings
    const userSettingsText = `User Info:
Sex: ${settings.sex.charAt(0).toUpperCase() + settings.sex.slice(1)}
Medical Conditions: ${settings.conditions.join(", ") || "None specified"}
Age Range: ${settings.age.range}
The user requested that you use ${selectedClarity.label.toLowerCase()} clarity level with your responses and reply in ${
      settings.language.name
    } language.`;

    // First API call to confirmMed
    const medResponse = await fetch("/api/confirmMed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicine: data }),
    });
    const medData = await medResponse.json();
    showToast("Medicine information verified", "success");

    if (!medData.brand_name) {
      throw new Error("Failed to get medication name");
    }

    // Second API call to FDA - now including user settings
    const fdaResponse = await fetch("/api/fda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand_name: medData.brand_name,
      }),
    });
    const fdaData = await fdaResponse.json();
    showToast("Fetched FDA data", "success");

    // Third API call to get side effects and herbal alternatives - now including user settings
    const sideEffectResponse = await fetch("/api/sideEffect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medicineName: medData.brand_name,
        purposeText: fdaData.data.results?.[0]?.purpose?.[0] || "",
        indicationsText:
          fdaData.data.results?.[0]?.indications_and_usage?.[0] || "",
        warningsText: fdaData.data.results?.[0]?.warnings?.[0] || "",
        patientInfoText:
          fdaData.data.results?.[0]?.patient_information?.[0] || "",
        storageText: fdaData.data.results?.[0]?.storage_and_handling?.[0] || "",
        inactiveIngredients:
          fdaData.data.results?.[0]?.inactive_ingredient || [],
        activeIngredients: fdaData.data.results?.[0]?.active_ingredient || [],
        structuredProductLabeling:
          fdaData.data.results?.[0]?.spl_product_data_elements || [],
        userSettings: userSettingsText,
      }),
    });
    const sideEffectData = await sideEffectResponse.json();
    showToast("Analyzed side effects and alternatives", "success");

    await window.sendWatsonMessage(
      `I'm looking up information about ${medData.brand_name}\n\n${userSettingsText}`
    );

    return {
      fdaData,
      sideEffectData,
      async getWatsonData() {
        const watsonResponse = await fetch("/api/watsonx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fdaData,
            sideEffectData,
            userSettings: userSettingsText,
          }),
        });
        return await watsonResponse.json();
      },
    };
  } catch (error) {
    throw error;
  }
};

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [languageQuery, setLanguageQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(settings.language);
  const [selectedClarity, setSelectedClarity] = useState(() => {
    const storedSettings = getStoredSettings();
    return (
      clarityLevels.find((level) => level.id === storedSettings.clarity.id) ||
      clarityLevels[0]
    );
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imgAnalyzed, setImgAnalyzed] = useState<{
    medicineName: string;
    alternativeNames: string[];
    fullText: string;
    objects: string[];
    logos: string[];
    labels: string[];
  } | null>(null);
  const [isLoadingMedInfo, setIsLoadingMedInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fdaData, setFdaData] = useState<any>(null);
  const [sideEffectData, setSideEffectData] = useState<any>(null);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedMedicine(searchQuery);
      setIsLoadingMedInfo(true);
      showToast("Fetching medicine information...", "success");

      try {
        const result = await api_calls(searchQuery, settings, selectedClarity);
        setFdaData(result.fdaData);
        setSideEffectData(result.sideEffectData);

        // Start Watson API call in background
        result
          .getWatsonData()
          .then((watsonData) => {
            showToast("Watson response retrieved", "success");
          })
          .catch((error) => {
            showToast("Watson processing failed", "error");
          });

        showToast("Medicine information retrieved successfully", "success");
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Failed to fetch medicine information",
          "error"
        );
      } finally {
        setIsLoadingMedInfo(false);
        setImgAnalyzed(null);
      }
    }
  };

  const handleSpeak = (text: string) => {
    // Placeholder for voice output functionality
    console.log("Speaking:", text);
  };

  const handleImageCapture = async (file: File) => {
    setIsAnalyzing(true);
    showToast("Analyzing image...", "success");

    try {
      const reader = new FileReader();

      const result = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/img-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: result }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setImgAnalyzed(data);

      if (data.medicineName) {
        setSelectedMedicine(data.medicineName);
        showToast(`Medicine detected: ${data.medicineName}`, "success");

        setIsLoadingMedInfo(true);
        const result = await api_calls(data, settings, selectedClarity);
        setFdaData(result.fdaData);
        setSideEffectData(result.sideEffectData);

        // Start Watson API call in background
        result
          .getWatsonData()
          .then((watsonData) => {
            showToast("Watson response retrieved", "success");
          })
          .catch((error) => {
            showToast("Watson processing failed", "error");
          });
      } else {
        showToast("Could not detect medicine name clearly", "error");
      }
    } catch (error) {
      showToast("Failed to analyze image", "error");
      throw error;
    } finally {
      setIsAnalyzing(false);
      setIsLoadingMedInfo(false);
    }
  };

  const filteredLanguages =
    languageQuery === ""
      ? languages
      : languages.filter((language) =>
          language.name.toLowerCase().includes(languageQuery.toLowerCase())
        );

  return (
    <div className="bg-gray-100 text-gray-900">
      <Toaster position="bottom-right" />

      <Header
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      <main className="container mx-auto p-4">
        {isSettingsOpen && (
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedClarity={selectedClarity}
            setSelectedClarity={setSelectedClarity}
            languageQuery={languageQuery}
            setLanguageQuery={setLanguageQuery}
          />
        )}

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex space-x-4 mb-4">
            <ImageUpload
              onImageCapture={handleImageCapture}
              isAnalyzing={isAnalyzing}
            />
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              setSelectedMedicine={setSelectedMedicine}
              setImgAnalyzed={setImgAnalyzed}
            />
          </div>

          {selectedMedicine && (
            <MedicineInfo
              selectedMedicine={selectedMedicine}
              imgAnalyzed={imgAnalyzed}
              fdaData={fdaData}
              sideEffectData={sideEffectData}
              handleSpeak={handleSpeak}
              isLoading={isLoadingMedInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
}
