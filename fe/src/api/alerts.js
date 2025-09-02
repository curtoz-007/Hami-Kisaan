import { supabase } from "./supabaseClient";
import { getUserProfile } from "./user";

export const fetchDiseaseAlerts = async () => {
  const { data, error } = await supabase.from("disease_detected").select("*");
  if (error) throw error;
  return data;
};

export const fetchUserLocation = async (userId) => {
  if (!userId) return null;
  try {
    const profile = await getUserProfile(userId);
    return {
      latitude: profile.latitude,
      longitude: profile.longitude,
    };
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
};
