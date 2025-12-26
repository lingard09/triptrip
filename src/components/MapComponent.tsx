import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "../types";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  places: Place[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (place: Place) => void;
  center: LatLngExpression;
  zoom: number;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapComponent({
  places,
  onMapClick,
  onMarkerClick,
  center,
  zoom,
}: MapComponentProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          eventHandlers={{
            click: () => onMarkerClick(place),
          }}
        >
          <Popup>
            <div style={{ minWidth: "150px" }}>
              <strong>{place.name}</strong>
              {place.memo && (
                <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
                  {place.memo}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
