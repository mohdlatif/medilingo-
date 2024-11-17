import { useState, useEffect } from "react";
import {
  Tab,
  Select,
  TabList,
  TabPanel,
  TabPanels,
  TabGroup,
} from "@headlessui/react";
import {
  Camera,
  Search,
  Volume2,
  Settings,
  X,
  Pill,
  Leaf,
  AlertTriangle,
  Info,
} from "lucide-react";
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

interface FormattedIngredients {
  active: string[];
  inactive: string[];
}

// API utility function
const api_calls = async (data: string) => {
  try {
    // First API call to confirmMed
    const medResponse = await fetch("/api/confirmMed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medicine: data }),
    });
    const medData = await medResponse.json();
    showToast("Medicine information verified", "success");

    if (!medData.brand_name) {
      throw new Error("Failed to get medication name");
    }

    // Second API call to FDA using the brand name
    const fdaResponse = await fetch("/api/fda", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brand_name: medData.brand_name }),
    });
    const fdaData = await fdaResponse.json();
    showToast("Fetched FDA data", "success");

    // Return FDA data immediately so UI can update
    return {
      fdaData,
      async getWatsonData() {
        const watsonResponse = await fetch("/api/watson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: fdaData }),
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
        const result = await api_calls(searchQuery);
        setFdaData(result.fdaData); // Set FDA data immediately

        // Start Watson API call in background
        result
          .getWatsonData()
          .then((watsonData) => {
            // Handle Watson data when it arrives
            // setWatsonData(watsonData);
            showToast("Watson response retrieved", "success");
          })
          .catch((error) => {
            console.error("Watson API error:", error);
            showToast("Watson processing failed", "error");
          });

        showToast("Medicine information retrieved successfully", "success");
      } catch (error) {
        console.error("Error fetching medicine information:", error);
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
      } else {
        showToast("Could not detect medicine name clearly", "error");
      }

      const secondResult = await api_calls(data);
      setFdaData(secondResult.fdaData);
    } catch (error) {
      console.error("Error processing image:", error);
      showToast("Failed to analyze image", "error");
      throw error;
    } finally {
      setIsAnalyzing(false);
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
              handleSpeak={handleSpeak}
              isLoading={isLoadingMedInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
}
