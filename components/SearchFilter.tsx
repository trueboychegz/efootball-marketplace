"use me"; // Ensure client component if needed, or pass state down

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
}

const PLATFORMS = ["All", "Android/iOS", "PlayStation", "PC", "Xbox"];

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  selectedPlatform,
  setSelectedPlatform,
}: SearchFilterProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
      {/* Search Bar */}
      <div className="w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search accounts (e.g. Epic, 1000 coins)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        {PLATFORMS.map((platform) => {
          const isActive = selectedPlatform === platform;
          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {platform}
            </button>
          );
        })}
      </div>
    </div>
  );
}
