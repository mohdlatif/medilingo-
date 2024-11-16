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
import { toast, Toaster } from "sonner";

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

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedMedicine(searchQuery);
      sendToWatson(`Tell me about ${searchQuery}`);
      setImgAnalyzed(null);
    }
  };

  const handleSpeak = (text: string) => {
    // Placeholder for voice output functionality
    console.log("Speaking:", text);
  };

  const handleImageCapture = async (file: File) => {
    setIsAnalyzing(true);
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
        sendToWatson(`Tell me about ${data.medicineName}`);
        toast.success(`Detected: ${data.medicineName}`);
      } else {
        toast.warning("Could not detect medicine name clearly");
      }

      return data;
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to analyze image");
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

  const sendToWatson = (text: string) => {
    // Get the instance using the global chat options
    const instance = (window as any).watsonAssistantChatOptions?.instance;

    if (instance) {
      instance.send({
        input: { text },
      });
    } else {
      console.warn("Watson Assistant instance not ready");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Toaster position="bottom-right" />
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pill className="h-8 w-8" />
            <h1 className="text-2xl font-bold">MediLingo+</h1>
          </div>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-full hover:bg-emerald-700 transition-colors"
            aria-label={isSettingsOpen ? "Close settings" : "Open settings"}
          >
            {isSettingsOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Settings className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {isSettingsOpen && (
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedClarity={selectedClarity}
            setSelectedClarity={(value) => {
              if (value) {
                setSelectedClarity(value);
                setSettings((prev) => ({ ...prev, clarity: value }));
              }
            }}
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
            <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === "") {
                    setSelectedMedicine("");
                    setImgAnalyzed(null);
                  }
                }}
                placeholder="Enter medicine name..."
                className="flex-1 rounded-l-lg border-y border-l border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-emerald-500 text-white px-6 py-2 rounded-r-lg hover:bg-emerald-600 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {selectedMedicine && (
            <div className="mt-4" id="medicine-info">
              <h2 className="text-2xl font-bold mb-4">{selectedMedicine}</h2>
              <TabGroup>
                <TabList className="flex space-x-1 rounded-xl bg-emerald-900/20 p-1">
                  {[
                    "Overview",
                    "Ingredients",
                    "Side Effects",
                    "Herbal Alternatives",
                  ].map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-emerald-700
                        ring-white ring-opacity-60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2
                        ${
                          selected
                            ? "bg-white shadow"
                            : "text-emerald-100 hover:bg-white/[0.12] hover:text-white"
                        }`
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </TabList>
                <TabPanels className="mt-2">
                  <TabPanel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        <Info className="inline h-5 w-5 mr-1" /> Overview
                      </h3>

                      <button
                        onClick={() => handleSpeak("Overview information")}
                        className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                        aria-label="Speak Overview"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Purpose and usage information for {selectedMedicine}.
                    </p>
                    {imgAnalyzed && (
                      <div className="mt-4 space-y-4">
                        {imgAnalyzed.alternativeNames.length > 0 && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Also known as:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600">
                              {imgAnalyzed.alternativeNames.map(
                                (name, index) => (
                                  <li key={index}>{name}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {imgAnalyzed.labels.length > 0 && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Identified Features:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {imgAnalyzed.labels.map((label, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {imgAnalyzed.fullText && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Package Information:
                            </h4>
                            <p className="text-gray-600 whitespace-pre-line text-sm">
                              {imgAnalyzed.fullText}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        <Pill className="inline h-5 w-5 mr-1" /> Ingredients
                      </h3>
                      <button
                        onClick={() => handleSpeak("Ingredients information")}
                        className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                        aria-label="Speak Ingredients"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2  text-gray-600">
                      Active and inactive compounds in {selectedMedicine}.
                    </p>
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        <AlertTriangle className="inline h-5 w-5 mr-1" /> Side
                        Effects
                      </h3>
                      <button
                        onClick={() => handleSpeak("Side effects information")}
                        className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                        aria-label="Speak Side Effects"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2  text-gray-600">
                      Common, rare, and severe side effects of{" "}
                      {selectedMedicine}.
                    </p>
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        <Leaf className="inline h-5 w-5 mr-1" /> Herbal
                        Alternatives
                      </h3>
                      <button
                        onClick={() =>
                          handleSpeak("Herbal alternatives information")
                        }
                        className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                        aria-label="Speak Herbal Alternatives"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Natural remedies and warnings related to{" "}
                      {selectedMedicine}.
                    </p>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
