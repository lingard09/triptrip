import { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { searchPlace } from "../utils/naverApi";

interface SearchResult {
  title: string;
  address: string;
  roadAddress: string;
  lat: number;
  lng: number;
}

interface PlaceSearchProps {
  onSelectPlace: (
    lat: number,
    lng: number,
    name: string,
    address: string
  ) => void;
}

export function PlaceSearch({ onSelectPlace }: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const data = await searchPlace(query, 10);

      if (data.status !== "OK") {
        throw new Error(data.errorMessage || "검색에 실패했습니다");
      }

      const searchResults: SearchResult[] = data.addresses.map((item) => ({
        title: item.roadAddress || item.jibunAddress,
        address: item.jibunAddress,
        roadAddress: item.roadAddress,
        lat: parseFloat(item.y),
        lng: parseFloat(item.x),
      }));

      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error("검색 오류:", error);
      alert("장소 검색에 실패했습니다. API 키를 확인해주세요.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectPlace(
      result.lat,
      result.lng,
      result.title,
      result.roadAddress || result.address
    );
    setShowResults(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="place-search">
      <div className="search-input-wrapper">
        <Search size={18} />
        <input
          type="text"
          placeholder="장소 검색 (예: 서울역, 강남역 카페)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {query && (
          <button
            className="clear-button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
          >
            <X size={16} />
          </button>
        )}
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? "검색중..." : "검색"}
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          <div className="search-results-header">
            <span>{results.length}개의 결과</span>
            <button onClick={() => setShowResults(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="search-results-list">
            {results.map((result, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleSelectResult(result)}
              >
                <div className="result-header">
                  <MapPin size={14} />
                  <strong>{result.title}</strong>
                </div>
                <div className="result-address">
                  {result.roadAddress || result.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResults && results.length === 0 && query && !isSearching && (
        <div className="search-results">
          <div className="empty-search-results">검색 결과가 없습니다.</div>
        </div>
      )}
    </div>
  );
}
