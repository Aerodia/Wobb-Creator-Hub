import type { ProfileDetailResponse, UserProfileSummary, SearchData } from "@/types";
import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

// Map of platform data to search for missing profile definitions
const platformSearchIndexes = [
  { platform: "instagram", data: instagramData as SearchData },
  { platform: "youtube", data: youtubeData as SearchData },
  { platform: "tiktok", data: tiktokData as SearchData },
];

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const lowercaseUsername = username.toLowerCase();
  const targetPath = `../assets/data/profiles/${lowercaseUsername}.json`;

  // 1. Attempt to find the profile JSON file case-insensitively
  const matchingKey = Object.keys(profileModules).find(
    (key) => key.toLowerCase() === targetPath
  );

  if (matchingKey) {
    const loader = profileModules[matchingKey];
    if (loader) {
      const result = await loader();
      const data =
        (result as { default?: ProfileDetailResponse }).default ?? result;
      return data as ProfileDetailResponse;
    }
  }

  // 2. Fallback: Synthesize the detailed profile dynamically from search indexes
  let foundSummary: UserProfileSummary | undefined;
  let foundPlatform = "unknown";

  for (const index of platformSearchIndexes) {
    const match = index.data.accounts.find((acc) => {
      const u = acc.account.user_profile;
      return (
        u.username?.toLowerCase() === lowercaseUsername ||
        u.handle?.toLowerCase() === lowercaseUsername
      );
    });

    if (match) {
      foundSummary = match.account.user_profile;
      foundPlatform = index.platform;
      break;
    }
  }

  if (foundSummary) {
    return {
      cached: false,
      data: {
        success: true,
        user_profile: {
          ...foundSummary,
          type: foundPlatform,
          description: `Highly engaging content creator on ${
            foundPlatform === "instagram" ? "Instagram" : foundPlatform === "youtube" ? "YouTube" : "TikTok"
          }. Add to your campaign list to start tracking metrics.`,
          posts_count: foundSummary.engagements ? Math.floor(foundSummary.followers / (foundSummary.engagements + 10)) : 142,
          avg_likes: foundSummary.engagements ? Math.floor(foundSummary.engagements * 0.95) : undefined,
          avg_comments: foundSummary.engagements ? Math.floor(foundSummary.engagements * 0.05) : undefined,
          avg_views: foundSummary.avg_views || 0,
          engagement_rate: foundSummary.engagement_rate,
        },
      },
    };
  }

  return null;
}
