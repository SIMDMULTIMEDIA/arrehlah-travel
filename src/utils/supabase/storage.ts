import { createClient } from "./client";

export async function uploadDocument(
  bucket: string,
  path: string,
  file: File,
  upsert = false
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw error;
  }

  return data;
}

export async function getDocumentUrl(bucket: string, path: string) {
  const supabase = createClient();
  // For private buckets, we should use createSignedUrl instead of getPublicUrl
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // URL valid for 1 hour

  if (error) {
    console.error("Storage get URL error:", error);
    throw error;
  }

  return data?.signedUrl;
}

export async function deleteDocument(bucket: string, path: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Storage delete error:", error);
    throw error;
  }

  return data;
}
