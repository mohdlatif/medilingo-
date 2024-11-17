import { type UserSettings } from "./options";
import {
  Radio,
  RadioGroup,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { IoFemale, IoMale } from "react-icons/io5";
import {
  medicalConditions,
  ageRanges,
  languages,
  clarityLevels,
} from "./options";

interface SettingsPanelProps {
  settings: UserSettings;
  setSettings: (settings: React.SetStateAction<UserSettings>) => void;
  selectedLanguage: { id: string; name: string };
  setSelectedLanguage: (language: { id: string; name: string }) => void;
  selectedClarity: { id: string; label: string };
  setSelectedClarity: (clarity: { id: string; label: string }) => void;
  languageQuery: string;
  setLanguageQuery: (query: string) => void;
}

export default function SettingsPanel({
  settings,
  setSettings,
  selectedLanguage,
  setSelectedLanguage,
  selectedClarity,
  setSelectedClarity,
  languageQuery,
  setLanguageQuery,
}: SettingsPanelProps) {
  const handleSexChange = (newSex: "male" | "female") => {
    setSettings((prev) => ({
      ...prev,
      sex: newSex,
      conditions: prev.conditions.filter((condition) =>
        medicalConditions.shared.some((c) => c.id === condition)
      ),
    }));
  };

  const handleConditionToggle = (conditionId: string) => {
    setSettings((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(conditionId)
        ? prev.conditions.filter((c) => c !== conditionId)
        : [...prev.conditions, conditionId],
    }));
  };

  const getAvailableConditions = () => [
    ...medicalConditions.shared,
    ...medicalConditions[settings.sex],
  ];

  const filteredLanguages =
    languageQuery === ""
      ? languages
      : languages.filter((language) =>
          language.name.toLowerCase().includes(languageQuery.toLowerCase())
        );

  const formatUserSettingsText = (
    settings: UserSettings,
    clarity: { id: string; label: string }
  ) => {
    const conditions = getAvailableConditions()
      .filter((c) => settings.conditions.includes(c.id))
      .map((c) => c.label)
      .join(", ");

    return `User Info:
Sex: ${settings.sex.charAt(0).toUpperCase() + settings.sex.slice(1)}
Medical Conditions: ${conditions || "None specified"}
Age Range: ${settings.age.range}
The user requested that you use ${clarity.label.toLowerCase()} clarity level with your responses and reply in ${
      settings.language.name
    } language.`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Sex Selection Card */}
          <div className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-200 transition-all shadow-sm">
            <span className="block text-lg font-medium text-emerald-900 mb-3">
              Sex
            </span>
            <RadioGroup
              value={settings.sex}
              onChange={handleSexChange}
              className="space-y-3"
              aria-label="Select sex"
            >
              <div className="grid grid-cols-2 gap-3">
                <Radio value="female" className="group">
                  {({ checked }) => (
                    <div
                      className={`
                      flex items-center justify-center p-4 rounded-xl cursor-pointer
                      border-2 transition-all duration-200
                      ${
                        checked
                          ? "bg-pink-50 border-pink-300 shadow-sm shadow-pink-100"
                          : "bg-white border-gray-200 hover:border-pink-200"
                      }
                    `}
                    >
                      <IoFemale
                        className={`h-6 w-6 mr-2 ${
                          checked ? "text-pink-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          checked ? "text-pink-700" : "text-gray-600"
                        }`}
                      >
                        Female
                      </span>
                    </div>
                  )}
                </Radio>
                <Radio value="male" className="group">
                  {({ checked }) => (
                    <div
                      className={`
                      flex items-center justify-center p-4 rounded-xl cursor-pointer
                      border-2 transition-all duration-200
                      ${
                        checked
                          ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-100"
                          : "bg-white border-gray-200 hover:border-blue-200"
                      }
                    `}
                    >
                      <IoMale
                        className={`h-6 w-6 mr-2 ${
                          checked ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          checked ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        Male
                      </span>
                    </div>
                  )}
                </Radio>
              </div>
            </RadioGroup>
          </div>

          {/* Medical Conditions Card */}
          <div className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-200 transition-all shadow-sm">
            <span className="block text-lg font-medium text-emerald-900 mb-3">
              Medical Conditions
            </span>
            <div className="grid grid-cols-2 gap-3">
              {getAvailableConditions().map((condition) => (
                <label
                  key={condition.id}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-100 
                  hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={settings.conditions.includes(condition.id)}
                    onChange={() => handleConditionToggle(condition.id)}
                    className="h-5 w-5 rounded-md
                    text-emerald-600
                    border-emerald-300
                    focus:ring-emerald-500
                    focus:ring-offset-0
                    focus:ring-2
                    checked:bg-emerald-600
                    checked:hover:bg-emerald-700
                    indeterminate:bg-emerald-600
                    hover:cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-emerald-900 font-medium">
                    {condition.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Age Selection Card */}
          <div className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-200 transition-all shadow-sm">
            <label
              htmlFor="age"
              className="block text-lg font-medium text-gray-800 mb-3"
            >
              Age Range
            </label>
            <Listbox
              value={settings.age}
              onChange={(newAge) =>
                setSettings((prev) => ({ ...prev, age: newAge }))
              }
            >
              <div className="relative">
                <ListboxButton
                  className="relative w-full rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-gray-200 
                  shadow-sm cursor-pointer hover:border-blue-200 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <span className="block truncate text-gray-700">
                    {settings.age.range}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </ListboxButton>
                <ListboxOptions
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1
                  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {ageRanges.map((age) => (
                    <ListboxOption
                      key={age.id}
                      value={age}
                      className={({ active, selected }) => `
                      relative cursor-pointer select-none py-2 pl-10 pr-4
                      ${active ? "bg-blue-50 text-blue-700" : "text-gray-700"}
                      ${selected ? "bg-blue-50" : ""}
                    `}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {age.range}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3
                              ${active ? "text-blue-600" : "text-blue-500"}`}
                            >
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {/* Language Settings Card */}
          <div className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-200 transition-all shadow-sm">
            <span className="block text-lg font-medium text-emerald-900 mb-3">
              Language Settings
            </span>
            <div className="grid grid-cols-2 gap-4">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Language
                </label>
                <Combobox
                  value={selectedLanguage}
                  onChange={(value) => {
                    if (value) {
                      setSelectedLanguage(value);
                      setSettings((prev) => ({
                        ...prev,
                        language: value,
                      }));
                    }
                  }}
                  onClose={() => setLanguageQuery("")}
                >
                  <div className="relative">
                    <ComboboxInput
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      displayValue={(language: (typeof languages)[0]) =>
                        language?.name
                      }
                      onChange={(event) => setLanguageQuery(event.target.value)}
                      placeholder="Search language..."
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </ComboboxButton>

                    <div className="relative">
                      <ComboboxOptions
                        className="absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1
                        text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        {filteredLanguages.map((language) => (
                          <ComboboxOption
                            key={language.id}
                            value={language}
                            className={({ active, selected }) => `
                            relative cursor-default select-none py-2 pl-10 pr-4
                            ${
                              active
                                ? "bg-emerald-50 text-emerald-900"
                                : "text-gray-900"
                            }
                            ${selected ? "bg-emerald-50" : ""}
                          `}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {language.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3
                                    ${
                                      active
                                        ? "text-emerald-600"
                                        : "text-emerald-500"
                                    }`}
                                  >
                                    <Check
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    </div>
                  </div>
                </Combobox>
              </div>

              {/* Clarity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clarity Level
                </label>
                <Listbox
                  value={selectedClarity}
                  onChange={(value) => {
                    setSelectedClarity(value);
                    setSettings((prev) => ({
                      ...prev,
                      clarity: value,
                    }));
                  }}
                >
                  <div className="relative">
                    <ListboxButton
                      className="relative w-full rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-200 
                      shadow-sm cursor-pointer hover:border-emerald-200 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <span className="block truncate text-gray-700">
                        {selectedClarity.label}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>
                    <ListboxOptions
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1
                      text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      {clarityLevels.map((level) => (
                        <ListboxOption
                          key={level.id}
                          value={level}
                          className={({ active, selected }) => `
                          relative cursor-pointer select-none py-2 pl-10 pr-4
                          ${
                            active
                              ? "bg-emerald-50 text-emerald-900"
                              : "text-gray-900"
                          }
                          ${selected ? "bg-emerald-50" : ""}
                        `}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {level.label}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3
                                ${
                                  active
                                    ? "text-emerald-600"
                                    : "text-emerald-500"
                                }`}
                                >
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
