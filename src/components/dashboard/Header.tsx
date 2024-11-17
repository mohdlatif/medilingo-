import { Pill, Settings, X } from "lucide-react";

interface HeaderProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export default function Header({
  isSettingsOpen,
  setIsSettingsOpen,
}: HeaderProps) {
  return (
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
  );
}
