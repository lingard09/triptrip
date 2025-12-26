import localforage from "localforage";
import type { Place } from "../types";

const PLACES_KEY = "triptrip_places";

export const storage = {
  async getPlaces(): Promise<Place[]> {
    const places = await localforage.getItem<Place[]>(PLACES_KEY);
    return places || [];
  },

  async savePlace(place: Place): Promise<void> {
    const places = await this.getPlaces();
    const existingIndex = places.findIndex((p) => p.id === place.id);

    if (existingIndex >= 0) {
      places[existingIndex] = place;
    } else {
      places.push(place);
    }

    await localforage.setItem(PLACES_KEY, places);
  },

  async deletePlace(id: string): Promise<void> {
    const places = await this.getPlaces();
    const filtered = places.filter((p) => p.id !== id);
    await localforage.setItem(PLACES_KEY, filtered);
  },

  async updatePlace(id: string, updates: Partial<Place>): Promise<void> {
    const places = await this.getPlaces();
    const index = places.findIndex((p) => p.id === id);

    if (index >= 0) {
      places[index] = { ...places[index], ...updates, updatedAt: Date.now() };
      await localforage.setItem(PLACES_KEY, places);
    }
  },
};
