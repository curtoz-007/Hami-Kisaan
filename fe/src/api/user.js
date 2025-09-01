import { supabase } from "./supabaseClient";

const TABLE = "users";

export async function createUserProfile({ id, fullName, email, role }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ id, full_name: fullName, email, role }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfile(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, full_name, email, role, phone, address, facebook_profile_url")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error; // 116 = No rows
  console.log("data by getUserProfile", data);
  return data || null;
}

export async function upsertUserProfile({
  id,
  fullName,
  email,
  role,
  phone,
  address,
  facebook_profile_url,
}) {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        id,
        full_name: fullName,
        email,
        role,
        phone,
        address,
        facebook_profile_url,
      },
      { onConflict: "id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export const updateUserLocation = async (id, latitude, longitude) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ latitude, longitude })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
