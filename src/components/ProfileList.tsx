import { useCallback, useEffect, useRef, useState } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { SearchX, Loader2 } from "lucide-react";

const PAGE_SIZE = 12;

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, searchQuery, onProfileClick }: ProfileListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination whenever the profile list changes (platform switch / filter change)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [profiles]);

  // IntersectionObserver: load more when sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, profiles.length));
        }
      },
      { rootMargin: "200px" } // start loading before the user hits the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [profiles.length]);

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

  const visibleProfiles = profiles.slice(0, visibleCount);
  const hasMore = visibleCount < profiles.length;

  return (
    <div className="flex flex-col gap-4">
      <ErrorBoundary fallbackMessage="Couldn't render some creator cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleProfiles.map((profile, i) => (
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
      </ErrorBoundary>

      {/* Sentinel div — observed by IntersectionObserver to trigger loading more */}
      <div ref={sentinelRef} className="flex items-center justify-center py-4 min-h-[40px]">
        {hasMore && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Loading more creators…</span>
          </div>
        )}
        {!hasMore && profiles.length > PAGE_SIZE && (
          <p className="text-xs text-[var(--text-muted)]">
            All {profiles.length} creators loaded
          </p>
        )}
      </div>
    </div>
  );
}
