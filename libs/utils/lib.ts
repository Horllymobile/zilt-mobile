import { formatDate } from "date-fns";

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
