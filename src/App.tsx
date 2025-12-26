import { useState, useEffect } from "react";
import "./App.css";
import { NaverMap } from "./components/NaverMap";
import { Sidebar } from "./components/Sidebar";
import { PlaceModal } from "./components/PlaceModal";
import type { Place } from "./types";
import { storage } from "./utils/storage";

function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Partial<Place> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    37.5665, 126.978,
  ]); // 서울 기본값
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const savedPlaces = await storage.getPlaces();
    setPlaces(savedPlaces);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPlace({ lat, lng });
    setIsModalOpen(true);
  };

  const handleMarkerClick = (place: Place) => {
    setMapCenter([place.lat, place.lng]);
    setMapZoom(15);
  };

  const handlePlaceEdit = (place: Place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handlePlaceSelect = (place: Place) => {
    setMapCenter([place.lat, place.lng]);
    setMapZoom(15);
  };

  const handlePlaceSave = async (
    placeData: Omit<Place, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = Date.now();

    if (selectedPlace?.id) {
      // 수정
      const updatedPlace: Place = {
        ...placeData,
        id: selectedPlace.id,
        createdAt: (selectedPlace as Place).createdAt,
        updatedAt: now,
      };
      await storage.savePlace(updatedPlace);
    } else {
      // 새로 추가
      const newPlace: Place = {
        ...placeData,
        id: `place-${now}`,
        createdAt: now,
        updatedAt: now,
      };
      await storage.savePlace(newPlace);
    }

    await loadPlaces();
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handlePlaceDelete = async (id: string) => {
    await storage.deletePlace(id);
    await loadPlaces();
  };

  return (
    <div className="app">
      <Sidebar
        places={places}
        onPlaceSelect={handlePlaceSelect}
        onPlaceEdit={handlePlaceEdit}
        onPlaceDelete={handlePlaceDelete}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="map-container">
        <NaverMap
          places={places}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <PlaceModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlace(null);
        }}
        onSave={handlePlaceSave}
        onDelete={selectedPlace?.id ? handlePlaceDelete : undefined}
      />
    </div>
  );
}

export default App;
