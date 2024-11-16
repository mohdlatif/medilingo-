// Medical Conditions
export const medicalConditions = {
  shared: [
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "Hypertension" },
    { id: "heartDisease", label: "Heart Disease" },
    { id: "allergies", label: "Allergies" },
    { id: "asthma", label: "Asthma" },
  ],
  male: [
    { id: "prostate", label: "Prostate Issues" },
    { id: "erectileDysfunction", label: "Erectile Dysfunction" },
    { id: "lowTestosterone", label: "Low Testosterone" },
  ],
  female: [
    { id: "pcos", label: "PCOS (Polycystic Ovary Syndrome)" },
    { id: "menopause", label: "Menopause" },
    { id: "endometriosis", label: "Endometriosis" },
  ],
};

// Age Ranges
export const ageRanges = [
  { id: 1, range: "Child (0–12)" },
  { id: 2, range: "Teen (13–17)" },
  { id: 3, range: "Adult (18–50)" },
  { id: 4, range: "Senior (50+)" },
];

// Languages
export const languages = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "ar", name: "Arabic" },
  { id: "bn", name: "Bengali" },
  { id: "bg", name: "Bulgarian" },
  { id: "zh", name: "Chinese" },
  { id: "hr", name: "Croatian" },
  { id: "cs", name: "Czech" },
  { id: "da", name: "Danish" },
  { id: "nl", name: "Dutch" },
  { id: "fa", name: "Farsi" },
  { id: "fi", name: "Finnish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "el", name: "Greek" },
  { id: "gu", name: "Gujarati" },
  { id: "he", name: "Hebrew" },
  { id: "hi", name: "Hindi" },
  { id: "hu", name: "Hungarian" },
  { id: "id", name: "Indonesian" },
  { id: "it", name: "Italian" },
  { id: "ja", name: "Japanese" },
  { id: "kn", name: "Kannada" },
  { id: "ko", name: "Korean" },
  { id: "lv", name: "Latvian" },
  { id: "lt", name: "Lithuanian" },
  { id: "ms", name: "Malay" },
  { id: "ml", name: "Malayalam" },
  { id: "mr", name: "Marathi" },
  { id: "no", name: "Norwegian" },
  { id: "pl", name: "Polish" },
  { id: "pt", name: "Portuguese" },
  { id: "pa", name: "Punjabi" },
  { id: "ro", name: "Romanian" },
  { id: "ru", name: "Russian" },
  { id: "sr", name: "Serbian" },
  { id: "sk", name: "Slovak" },
  { id: "sl", name: "Slovenian" },
  { id: "sw", name: "Swahili" },
  { id: "sv", name: "Swedish" },
  { id: "ta", name: "Tamil" },
  { id: "te", name: "Telugu" },
  { id: "th", name: "Thai" },
  { id: "tr", name: "Turkish" },
  { id: "uk", name: "Ukrainian" },
  { id: "ur", name: "Urdu" },
  { id: "vi", name: "Vietnamese" },
];

// Clarity Levels
export const clarityLevels = [
  { id: "simple", label: "Very Simple" },
  { id: "standard", label: "Standard" },
  { id: "technical", label: "Detailed and Technical" },
];

// Types
export interface UserSettings {
  sex: "male" | "female";
  age: { id: number; range: string };
  conditions: string[];
  language: { id: string; name: string };
  clarity: { id: string; label: string };
}

export const defaultSettings: UserSettings = {
  sex: "female",
  age: { id: 3, range: "Adult (18–50)" },
  conditions: [],
  language: { id: "en", name: "English" },
  clarity: { id: "standard", label: "Standard" },
};
