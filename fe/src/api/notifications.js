import { supabase } from "./supabaseClient";

export const getAlerts = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("notices")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data;  
};

export const getTodos = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("todo")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data;
};