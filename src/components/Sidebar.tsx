import { useState } from "react";
import { Search, MapPin, Edit, Trash2, X, Menu } from "lucide-react";
import type { Place } from "../types";

interface SidebarProps {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  onPlaceEdit: (place: Place) => void;
  onPlaceDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  places,
  onPlaceSelect,
  onPlaceEdit,
  onPlaceDelete,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(places.map((p) => p.category).filter(Boolean))),
  ];

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.memo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1>내 장소</h1>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="장소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sidebar-content">
          {filteredPlaces.length === 0 ? (
            <div className="empty-state">
              <MapPin size={48} />
              <p>저장된 장소가 없습니다</p>
              <p className="empty-hint">지도를 클릭하여 장소를 추가하세요</p>
            </div>
          ) : (
            <div className="places-list">
              {filteredPlaces.map((place) => (
                <div key={place.id} className="place-item">
                  <div
                    className="place-info"
                    onClick={() => onPlaceSelect(place)}
                  >
                    <div className="place-header">
                      <h3>{place.name}</h3>
                      {place.category && (
                        <span className="place-category">{place.category}</span>
                      )}
                    </div>
                    {place.memo && <p className="place-memo">{place.memo}</p>}
                    <div className="place-coords">
                      {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                    </div>
                  </div>
                  <div className="place-actions">
                    <button
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaceEdit(place);
                      }}
                      title="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("이 장소를 삭제하시겠습니까?")) {
                          onPlaceDelete(place.id);
                        }
                      }}
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="stats">총 {places.length}개의 장소</div>
        </div>
      </div>
    </>
  );
}
