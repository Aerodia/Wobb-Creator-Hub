import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { Plus, Check, Eye } from "lucide-react";

import { Avatar } from "./Avatar";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

// Custom SVGs for platform indicator
function PlatformIndicator({ platform }: { platform: Platform }) {
  const getStyle = () => {
    if (platform === "instagram") return "text-pink-400 bg-pink-500/10 border-pink-500/20";
    if (platform === "youtube") return "text-red-400 bg-red-500/10 border-red-500/20";
    return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
  };

  const getPath = () => {
    if (platform === "instagram") {
      return (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    }
    if (platform === "youtube") {
      return (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.05 3.73 2.45v3.83c-1.39-.08-2.77-.51-3.97-1.23-.74-.45-1.4-1.01-1.95-1.68V14.5c.01 1.77-.45 3.53-1.35 5.04-1.12 1.83-2.92 3.19-5.02 3.75-2.09.58-4.35.34-6.28-.68-1.94-1.01-3.39-2.79-4.01-4.9-.66-2.22-.38-4.63.78-6.6 1.13-1.92 3.02-3.32 5.23-3.85 1.4-.35 2.87-.27 4.22.21v3.9c-.84-.42-1.79-.58-2.72-.45-1.02.13-1.98.67-2.65 1.48-.68.82-.99 1.9-.84 2.96.14 1.05.74 2.01 1.61 2.62.88.63 1.97.82 2.98.54.98-.26 1.83-.93 2.34-1.84.34-.61.5-1.3.48-2v-12.9z" />
      </svg>
    );
  };

  return (
    <div className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center ${getStyle()}`} title={`Platform: ${platform}`}>
      {getPath()}
    </div>
  );
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isInList } = useListStore();
  
  const isSelected = isInList(profile.user_id);

  const handleClick = () => {
    const activeUsername = profile.username || profile.handle || "creator";
    if (onProfileClick) onProfileClick(activeUsername);
    navigate(`/profile/${activeUsername}?platform=${platform}`);
  };

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile, platform);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between items-center text-center relative overflow-hidden group cursor-pointer w-full h-[320px]"
      data-search={searchQuery}
    >
      {/* Floating platform indicator */}
      <div className="absolute top-4 right-4 z-10">
        <PlatformIndicator platform={platform} />
      </div>

      <div className="flex flex-col items-center w-full">
        {/* Creator Avatar with Hover Glow */}
        <div className="relative mb-4">
          <Avatar
            src={profile.picture}
            alt={profile.fullname}
            className="w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-violet-500/80 group-hover:scale-105 transition-all duration-300 object-cover"
            fallbackText={profile.username || profile.handle || "creator"}
          />
          <div className="absolute inset-0 rounded-full bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Creator Identity */}
        <div className="w-full px-2">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1 leading-snug group-hover:text-violet-400 transition-colors">
            <span className="truncate max-w-[85%]">@{profile.username || profile.handle || "creator"}</span>
            <VerifiedBadge verified={profile.is_verified} />
          </h3>
          <p className="text-xs text-slate-400 font-medium truncate mt-1">
            {profile.fullname}
          </p>
        </div>
      </div>

      {/* Basic Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 w-full py-4 border-y border-white/5 my-2">
        <div className="text-center">
          <span className="block text-sm font-extrabold text-white">
            {formatFollowers(profile.followers)}
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">
            Followers
          </span>
        </div>
        <div className="text-center">
          <span className="block text-sm font-extrabold text-white">
            {profile.engagement_rate !== undefined
              ? formatEngagementRate(profile.engagement_rate)
              : profile.avg_views !== undefined && profile.avg_views > 0
              ? formatFollowers(profile.avg_views)
              : "N/A"}
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">
            {profile.engagement_rate !== undefined ? "Engagement" : "Avg Views"}
          </span>
        </div>
      </div>

      {/* Responsive interactive Buttons */}
      <div className="flex gap-2 w-full mt-2">
        <button
          onClick={handleToggleList}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
            isSelected
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
              : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-violet-400" />
              <span>Save List</span>
            </>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
