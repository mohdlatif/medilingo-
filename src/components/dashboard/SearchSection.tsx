import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  setSelectedMedicine: (medicine: string) => void;
  setImgAnalyzed: (data: any) => void;
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
  setSelectedMedicine,
  setImgAnalyzed,
}: SearchSectionProps) {
  return (
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
  );
}
