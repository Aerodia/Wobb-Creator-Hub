import { useCallback } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { SearchX } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, searchQuery, onProfileClick }: ProfileListProps) {
  const stableOnProfileClick = useCallback(
    (username: string) => onProfileClick(username),
    [onProfileClick]
  );

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        >
          <SearchX className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">No creators found</h3>
        {searchQuery ? (
          <p className="text-xs text-[var(--text-muted)] max-w-xs">
            No results for <span className="font-medium text-[var(--text-secondary)]">"{searchQuery}"</span>.
            Try a different name or handle.
          </p>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">No creators available for this platform.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {profiles.map((profile, i) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={stableOnProfileClick}
          index={i}
        />
      ))}
    </div>
  );
}
