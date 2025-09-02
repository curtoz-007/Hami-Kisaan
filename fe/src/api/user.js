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
    .select(
      "id, full_name, email, role, phone, address, facebook_profile_url, latitude, longitude"
    )
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error; // 116 = No rows
  return data || null;
}

export const uploadKYCFile = async (file) => {
  try {
    // Upload the KYC  to Supabase Storage
    const uniqueFileName = `${Date.now()}_${file?.name || "file"}`;
    const { data, error: uploadError } = await supabase.storage
      .from("images")
      .upload(`KYC/${uniqueFileName}`, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type, // Important for images
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL of the uploaded thumbnail
    const { data: imageData, error: urlError } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    if (urlError) {
      throw urlError;
    }
    return imageData.publicUrl;
  } catch (error) {
    console.log("Error uploading thumbnail file:", error);
  }
};

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
