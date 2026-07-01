import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import type { Platform, FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { Avatar } from "@/components/Avatar";
import { MetricCard } from "@/components/MetricCard";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Users,
  Heart,
  MessageSquare,
  Eye,
  Layers,
  Activity,
  Award,
  CirclePlay,
} from "lucide-react";

// Platform badge inline
function PlatformPill({ platform }: { platform: string }) {
  const style =
    platform === "instagram" ? "badge-instagram" :
    platform === "youtube"   ? "badge-youtube"   : "badge-tiktok";
  return <span className={`badge ${style} capitalize`}>{platform}</span>;
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const isSelected  = useListStore((s) => s.selectedProfiles.some((p) => p.user_id === (profileData?.data?.user_profile?.user_id ?? "")));
  const addProfile  = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
    // Reset display state when navigating to a different profile
    return () => { setLoaded(false); setProfileData(null); };
  }, [username]);

  const handleToggleList = useCallback(() => {
    if (!profileData) return;
    const user = profileData.data.user_profile;
    if (isSelected) removeProfile(user.user_id);
    else addProfile(user, platform as Platform);
  }, [addProfile, isSelected, platform, profileData, removeProfile]);

  /* ── Loading skeleton ── */
  if (!loaded) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-4 w-28 shimmer rounded" />
          <div className="h-36 shimmer rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 shimmer rounded-lg" />)}
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Not found ── */
  if (!username || !profileData) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-16">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
          >
            <Users className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Profile Not Found</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            We couldn't find data for @{username}. They may not be in our database.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout
      title={`@${user.username || user.handle || username}`}
      subtitle="Creator Profile"
      headerActions={
        <div className="flex items-center gap-2">
          <button onClick={handleToggleList} className={isSelected ? "btn-saved" : "btn-primary"}>
            {isSelected
              ? <><BookmarkCheck className="w-4 h-4" /><span>Saved</span></>
              : <><Bookmark className="w-4 h-4" /><span>Save to List</span></>}
          </button>
          {user.url && (
            <a href={user.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Profile</span>
            </a>
          )}
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Back breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Discover</span>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{user.username || user.handle}</span>
        </Link>

        {/* ── Creator identity card ── */}
        <div className="surface-card p-6 flex flex-col sm:flex-row gap-5 items-start anim-fade-in-up" style={{ animationDelay: "60ms" }}>
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar
              src={user.picture}
              alt={user.fullname}
              className="w-20 h-20 rounded-full object-cover"
              fallbackText={user.username || user.handle || "creator"}
            />
            {user.is_verified && (
              <span className="absolute -bottom-0.5 -right-0.5">
                <VerifiedBadge verified />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                @{user.username || user.handle}
              </h2>
              <PlatformPill platform={platform} />
              {user.is_business && (
                <span className="badge" style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.2)" }}>Business</span>
              )}
            </div>
            {user.fullname && (
              <p className="text-sm text-[var(--text-secondary)] mb-2">{user.fullname}</p>
            )}
            {user.description && (
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">{user.description}</p>
            )}

            {/* Demographics inline */}
            {(user.gender || user.age_group) && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {user.gender && (
                  <span className="text-xs text-[var(--text-muted)]">
                    Gender: <span className="text-[var(--text-secondary)] capitalize font-medium">{user.gender}</span>
                  </span>
                )}
                {user.age_group && (
                  <span className="text-xs text-[var(--text-muted)]">
                    Age group: <span className="text-[var(--text-secondary)] font-medium">{user.age_group}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── KPI metric row ── */}
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Performance Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              <MetricCard key="followers" icon={Users} label="Followers" value={formatFollowers(user.followers)} subtext="Total audience" colorClass="text-indigo-400" />,
              <MetricCard key="engagement" icon={Activity} label="Engagement" value={user.engagement_rate !== undefined ? (user.engagement_rate * 100).toFixed(2) + "%" : "N/A"} subtext="Interaction rate" colorClass="text-pink-400" />,
              ...(user.posts_count !== undefined ? [<MetricCard key="posts" icon={Layers} label="Posts" value={user.posts_count.toLocaleString()} subtext="Total publications" colorClass="text-cyan-400" />] : []),
              ...(user.avg_likes !== undefined ? [<MetricCard key="likes" icon={Heart} label="Avg Likes" value={formatFollowers(user.avg_likes)} subtext="Per post average" colorClass="text-rose-400" />] : []),
              ...(user.avg_comments !== undefined ? [<MetricCard key="comments" icon={MessageSquare} label="Avg Comments" value={user.avg_comments.toLocaleString()} subtext="Per post average" colorClass="text-violet-400" />] : []),
              ...(user.avg_views !== undefined && user.avg_views > 0 ? [<MetricCard key="views" icon={Eye} label="Avg Views" value={formatFollowers(user.avg_views)} subtext="Video view average" colorClass="text-amber-400" />] : []),
              ...(user.avg_reels_plays !== undefined && user.avg_reels_plays > 0 ? [<MetricCard key="reels" icon={CirclePlay} label="Reels Plays" value={formatFollowers(user.avg_reels_plays)} subtext="Avg reels views" colorClass="text-emerald-400" />] : []),
              ...((user.gender || user.age_group) ? [<MetricCard key="audience" icon={Award} label="Audience" value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : user.age_group || "—"} subtext={user.age_group ? `Age: ${user.age_group}` : "Primary demographic"} colorClass="text-yellow-400" />] : []),
            ].map((card, i) => (
              <div key={i} className="anim-fade-in-up" style={{ animationDelay: `${80 + i * 50}ms` }}>
                {card}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
