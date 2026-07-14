const DEV = import.meta.env.DEV;

export const API = DEV ? "http://localhost:3001/api" : "/api";

export function imgUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (DEV) return `http://localhost:3001${url}`;
  return url;
}
