import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";
import { Avatar } from "./Avatar";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
  /** Grid position — used to stagger the card entry animation */
  index?: number;
}

function EngagementBadge({ rate }: { rate?: number }) {
  if (rate === undefined) return null;
  const pct = rate * 100;
  if (pct >= 3)  return <span className="badge badge-high">{pct.toFixed(1)}% eng.</span>;
  if (pct >= 1)  return <span className="badge badge-medium">{pct.toFixed(1)}% eng.</span>;
  return             <span className="badge badge-low">{pct.toFixed(1)}% eng.</span>;
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return <span className={`badge badge-${platform}`}>{platform}</span>;
}

function ProfileCardComponent({ profile, platform, onProfileClick, index = 0 }: ProfileCardProps) {
  const navigate = useNavigate();

  const isSelected   = useListStore((s) => s.selectedProfiles.some((p) => p.user_id === profile.user_id));
  const addProfile   = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);

  // Drives the icon-pop animation on the bookmark when saving
  const [justSaved, setJustSaved] = useState(false);

  const username    = profile.username || profile.handle || "creator";
  const displayName = `@${username}`;

  const handleClick = useCallback(() => {
    if (onProfileClick) onProfileClick(username);
    navigate(`/profile/${username}?platform=${platform}`);
  }, [navigate, onProfileClick, platform, username]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile, platform);
      // Trigger pop animation briefly
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 500);
    }
  }, [addProfile, isSelected, platform, profile, removeProfile]);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  }, [handleClick]);

  const secondStat = useMemo(() => {
    if (profile.engagement_rate !== undefined)
      return { value: formatEngagementRate(profile.engagement_rate), label: "Engagement" };
    if (profile.avg_views !== undefined && profile.avg_views > 0)
      return { value: formatFollowers(profile.avg_views), label: "Avg Views" };
    return null;
  }, [profile.avg_views, profile.engagement_rate]);

  // Stagger delay capped at 8 cards to avoid long waits on large grids
  const staggerDelay = `${Math.min(index, 8) * 45}ms`;

  return (
    <div
      onClick={handleClick}
      className="surface-card p-5 flex flex-col gap-4 cursor-pointer relative anim-fade-in-up"
      style={{ borderRadius: "12px", animationDelay: staggerDelay }}
    >
      {/* Top row: Avatar + name + badges */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar
            src={profile.picture}
            alt={profile.fullname}
            className="w-12 h-12 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
            fallbackText={username}
          />
          {profile.is_verified && (
            <span className="absolute -bottom-0.5 -right-0.5">
              <VerifiedBadge verified />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {displayName}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{profile.fullname}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <PlatformBadge platform={platform} />
            <EngagementBadge rate={profile.engagement_rate} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid gap-px rounded-lg overflow-hidden"
        style={{ gridTemplateColumns: secondStat ? "1fr 1fr" : "1fr", background: "var(--border-subtle)" }}
      >
        <div className="py-3 px-3 flex flex-col gap-0.5" style={{ background: "var(--bg-base)" }}>
          <span className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums">
            {formatFollowers(profile.followers)}
          </span>
          <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Followers</span>
        </div>
        {secondStat && (
          <div className="py-3 px-3 flex flex-col gap-0.5" style={{ background: "var(--bg-base)" }}>
            <span className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums">{secondStat.value}</span>
            <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">{secondStat.label}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          className={`press-active ${isSelected ? "btn-saved flex-1 justify-center" : "btn-ghost flex-1 justify-center"}`}
          style={{ padding: "7px 12px", fontSize: "12px" }}
          title={isSelected ? "Remove from list" : "Save to list"}
        >
          {isSelected ? (
            <>
              {/* Show pop animation on the icon right when saved */}
              <BookmarkCheck className={`w-3.5 h-3.5 ${justSaved ? "anim-icon-pop" : ""}`} />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </>
          )}
        </button>
        <button
          onClick={handleOpen}
          className="btn-ghost press-active"
          style={{ padding: "7px 10px" }}
          title="View profile"
        >
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);
