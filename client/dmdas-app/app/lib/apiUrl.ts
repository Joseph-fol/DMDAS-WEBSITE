const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

export const apiBaseUrl = configuredApiUrl
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}