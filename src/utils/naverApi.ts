// 네이버 클라우드 Maps Geocoding API
// 문서: https://api.ncloud-docs.com/docs/application-maps-geocoding

export interface GeocodingResult {
  roadAddress: string;
  jibunAddress: string;
  x: string; // 경도
  y: string; // 위도
  distance: number;
}

export interface GeocodingResponse {
  status: string;
  meta: {
    totalCount: number;
    page: number;
    count: number;
  };
  addresses: GeocodingResult[];
  errorMessage?: string;
}

export async function searchPlace(
  query: string,
  count: number = 10
): Promise<GeocodingResponse> {
  try {
    // Vite 프록시를 통해 API 호출 (CORS 문제 해결)
    const response = await fetch(
      `/api/geocode?query=${encodeURIComponent(query)}&count=${count}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 오류 응답:", errorText);
      throw new Error(`검색 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("장소 검색 오류:", error);
    throw error;
  }
}
