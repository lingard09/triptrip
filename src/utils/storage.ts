import { supabase } from "../lib/supabase";
import type { Place } from "../types";

export const storage = {
  async getPlaces(): Promise<Place[]> {
    try {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Failed to fetch places:", error);
      return [];
    }
  },

  async savePlace(place: Place): Promise<void> {
    try {
      // user_id 제거 (익명 사용자 지원)
      const { error } = await supabase.from("places").upsert(place);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to save place:", error);
      throw error;
    }
  },

  async deletePlace(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("places").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to delete place:", error);
      throw error;
    }
  },

  async updatePlace(id: string, updates: Partial<Place>): Promise<void> {
    try {
      const { error } = await supabase
        .from("places")
        .update({ ...updates, updatedAt: Date.now() })
        .eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to update place:", error);
      throw error;
    }
  },
};
