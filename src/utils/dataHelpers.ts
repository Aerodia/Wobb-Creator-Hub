import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube:   youtubeData as SearchData,
  tiktok:    tiktokData as SearchData,
};

/**
 * Fills in safe defaults for any missing or null fields on a raw profile object.
 * This prevents downstream crashes when a JSON entry is malformed.
 */
export function sanitizeProfile(raw: Partial<UserProfileSummary>): UserProfileSummary {
  return {
    user_id:        String(raw.user_id ?? `unknown-${Math.random().toString(36).slice(2)}`),
    username:       raw.username || raw.handle || undefined,
    handle:         raw.handle   || raw.username || undefined,
    url:            raw.url      || "",
    picture:        raw.picture  || "",
    fullname:       raw.fullname || raw.username || raw.handle || "Unknown Creator",
    is_verified:    raw.is_verified ?? false,
    followers:      typeof raw.followers === "number" && !isNaN(raw.followers) ? raw.followers : 0,
    engagements:    typeof raw.engagements === "number" ? raw.engagements : undefined,
    engagement_rate:typeof raw.engagement_rate === "number" ? raw.engagement_rate : undefined,
    avg_views:      typeof raw.avg_views === "number" ? raw.avg_views : undefined,
  };
}

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  const results: UserProfileSummary[] = [];

  for (const item of data.accounts) {
    try {
      // Guard against missing account / user_profile nesting
      const raw = item?.account?.user_profile;
      if (!raw) continue;
      results.push(sanitizeProfile(raw as Partial<UserProfileSummary>));
    } catch {
      // Skip malformed entries silently — never crash the whole list
    }
  }

  return results;
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const lowercaseQuery = query.toLowerCase();
  return profiles.filter((p) => {
    const matchUsername = p.username
      ? p.username.toLowerCase().includes(lowercaseQuery)
      : false;
    const matchHandle = p.handle
      ? p.handle.toLowerCase().includes(lowercaseQuery)
      : false;
    const matchFullname = p.fullname
      ? p.fullname.toLowerCase().includes(lowercaseQuery)
      : false;
    return matchUsername || matchHandle || matchFullname;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube")   return "YouTube";
  return "TikTok";
}
