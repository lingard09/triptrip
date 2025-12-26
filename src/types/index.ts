export type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  memo: string;
  category?: string;
  createdAt: number;
  updatedAt: number;
};

export type MapState = {
  center: [number, number];
  zoom: number;
};
