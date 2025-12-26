import { createClient } from "@supabase/supabase-js";
import type { Place } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      places: {
        Row: Place;
        Insert: Omit<Place, "id" | "createdAt" | "updatedAt"> & {
          id?: string;
          createdAt?: number;
          updatedAt?: number;
        };
        Update: Partial<Omit<Place, "id">>;
      };
    };
  };
}
