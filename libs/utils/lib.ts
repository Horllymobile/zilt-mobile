import { formatDate } from "date-fns";
import { supabase } from "../superbase";

export const formatErrorMessage = (
  error: any,
  fallbackMessage = "Something went wrong"
) => {
  if (Array.isArray(error?.data?.message)) return error.data.message[0];

  if (Array.isArray(error?.data?.errors)) return error.data.errors[0]?.msg;

  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.message?.message ||
    error?.message ||
    fallbackMessage
  );
};

export const parseSupabaseUrl = (url: string) => {
  let parsedUrl = url;
  if (url.includes("#")) {
    parsedUrl = url.replace("#", "?");
  }

  return parsedUrl;
};

export const uploadProfileSvg = async (image: string, name: string) => {
  const filePath = `avatars/${name}-profile.svg`;

  const base64 = btoa(unescape(encodeURIComponent(image)));
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

  await supabase.storage.from("ZiltStorage").remove([filePath]);

  const { error } = await supabase.storage
    .from("ZiltStorage")
    .upload(filePath, bytes, {
      contentType: "image/svg+xml",
    });

  if (error) throw new Error(error.message);

  const { data: publicUrl } = supabase.storage
    .from("ZiltStorage")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
};

export function timeAgo(value: string): string {
  const date = new Date(value);
  const now = new Date().getTime();
  const past = typeof date === "number" ? date : date.getTime();
  const diff = Math.floor((now - past) / 1000); // in seconds

  if (diff < 60) return `${diff}s ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${formatDate(value, "dd MMM yyyy hh:mm a")}`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}
