/** Build the optional HTTPS origin used to serve application-hosted media. */
export function getMediaOrigin(env = process.env) {
  const explicit = String(env.MEDIA_PUBLIC_URL || "").trim();
  if (explicit) {
    try {
      const url = new URL(explicit);
      if (url.protocol === "https:") return url.origin;
    } catch {
      // Invalid values fall back to the configured public app origin.
    }
  }

  const appOrigin = String(env.APP_PUBLIC_URL || "")
    .split(",")[0]
    .trim();
  if (!appOrigin) return "";
  try {
    const url = new URL(appOrigin);
    if (url.protocol !== "https:") return "";
    const port = Number(env.MEDIA_PORT || 8443);
    return `${url.protocol}//${url.hostname}:${port}`;
  } catch {
    return "";
  }
}

export function toMediaUrl(value, mediaOrigin) {
  const raw = String(value || "").trim();
  if (!raw || !mediaOrigin || !raw.startsWith("/api/uploads/")) return value;
  return `${mediaOrigin}${raw}`;
}
