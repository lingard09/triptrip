import { useEffect, useRef } from "react";
import type { Place } from "../types";

interface NaverMapProps {
  places: Place[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (place: Place) => void;
  center: [number, number];
  zoom: number;
}

export function NaverMap({
  places,
  onMapClick,
  onMarkerClick,
  center,
  zoom,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(center[0], center[1]),
      zoom: zoom,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 지도 클릭 이벤트
    window.naver.maps.Event.addListener(map, "click", (e: any) => {
      const lat = e.coord.lat();
      const lng = e.coord.lng();
      onMapClick(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        window.naver.maps.Event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, []);

  // 지도 중심 및 줌 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && window.naver) {
      const newCenter = new window.naver.maps.LatLng(center[0], center[1]);
      mapInstanceRef.current.setCenter(newCenter);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 생성
    places.forEach((place) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.lat, place.lng),
        map: mapInstanceRef.current,
        title: place.name,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, "click", () => {
        onMarkerClick(place);
      });

      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 150px;">
            <strong style="font-size: 14px; color: #333">${place.name}</strong>
            ${
              place.memo
                ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${place.memo}</p>`
                : ""
            }
          </div>
        `,
      });

      // 마커에 마우스 오버 시 정보창 표시
      window.naver.maps.Event.addListener(marker, "mouseover", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      window.naver.maps.Event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => {
        window.naver.maps.Event.clearInstanceListeners(marker);
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [places, onMarkerClick]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
