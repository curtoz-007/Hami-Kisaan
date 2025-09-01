import { supabase } from "./supabaseClient";

const TABLE = "listings";

export async function createListing({
  name,
  price,
  unit,
  quantity,
  image_url,
  userId,
}) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, price, unit, quantity, image_url, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const getListings = async () => {
  const { data: listings, error: listingsError } = await supabase
    .from(TABLE)
    .select("*");
  if (listingsError) throw listingsError;

  // Fetch user details for each listing in parallel
  const enrichedListings = await Promise.all(
    listings.map(async (listing) => {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, full_name, email, address, phone, facebook_profile_url")
        .eq("id", listing.user_id)
        .maybeSingle();
      if (usersError) throw usersError;
      return {
        ...listing,
        user: usersData,
      };
    })
  );

  return enrichedListings;
};

export const uploadFile = async (file) => {
  try {
    // Upload the thumbnail to Supabase Storage
    const uniqueFileName = `${Date.now()}_${file?.name || "file"}`;
    const { data, error: uploadError } = await supabase.storage
      .from("images")
      .upload(`crops/${uniqueFileName}`, file, {
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
