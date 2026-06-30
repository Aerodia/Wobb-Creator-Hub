import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import type { Platform, FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { Avatar } from "@/components/Avatar";
import { 
  ArrowLeft, 
  ExternalLink, 
  Plus, 
  Check, 
  Users, 
  Heart, 
  MessageSquare, 
  Eye, 
  Layers, 
  Activity,
  Award,
  CirclePlay
} from "lucide-react";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const { addProfile, removeProfile, isInList } = useListStore();

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 font-semibold mb-4">Invalid profile request.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="h-6 w-24 shimmer rounded-lg" />
          <div className="h-48 shimmer rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-28 shimmer rounded-2xl" />
            <div className="h-28 shimmer rounded-2xl" />
            <div className="h-28 shimmer rounded-2xl" />
            <div className="h-28 shimmer rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="text-center py-12 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">Creator Profile Not Found</h2>
          <p className="text-slate-400 mb-6">
            We couldn't retrieve the detailed data for @{username}. It might not be available in our database.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/20 hover:opacity-95 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isSelected = isInList(user.user_id);

  const handleToggleList = () => {
    if (isSelected) {
      removeProfile(user.user_id);
    } else {
      addProfile(user, platform as Platform);
    }
  };

  const getPlatformClass = () => {
    if (platform === "instagram") return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
    if (platform === "youtube") return "bg-red-500/10 text-red-400 border border-red-500/20";
    return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-1">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-violet-400" />
        <span>Back to search</span>
      </Link>

      {/* Hero card */}
      <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left w-full mb-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Creator Big Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar
            src={user.picture}
            alt={user.fullname}
            className="w-28 h-28 rounded-full border-4 border-white/10 shadow-xl object-cover"
            fallbackText={user.username || user.handle || "creator"}
          />
          {user.is_verified && (
            <span className="absolute -bottom-1 -right-1 bg-[#080c14] p-1 rounded-full border-2 border-white/10 text-blue-400">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
          )}
        </div>

        {/* Identity Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white truncate">
              @{user.username}
            </h2>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPlatformClass()}`}>
                {platform}
              </span>
              {user.is_business && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  Business
                </span>
              )}
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-slate-300 mt-1">{user.fullname}</h3>
          
          {user.description && (
            <p className="mt-4 text-sm text-slate-400 max-w-2xl leading-relaxed italic">
              "{user.description}"
            </p>
          )}

          {/* Action button bar */}
          <div className="flex flex-wrap items-center gap-3 mt-6 justify-center md:justify-start">
            <button
              onClick={handleToggleList}
              className={`flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white border-transparent shadow-lg shadow-violet-500/10 active:scale-95"
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to List</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to List</span>
                </>
              )}
            </button>

            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2.5 px-6 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-sm font-bold border border-white/10 transition-colors"
              >
                <span>View on Platform</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Detail Metrics Title */}
      <h3 className="text-lg font-bold text-white mb-4 px-1">Performance Insights</h3>

      {/* Metrics Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {/* Metric Card - Followers */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
            <Users className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span>Followers</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1.5">
              {formatFollowers(user.followers)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400">Total Audience</div>
        </div>

        {/* Metric Card - Engagement */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
            <Activity className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>Engagement</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1.5">
              {user.engagement_rate !== undefined
                ? (user.engagement_rate * 100).toFixed(2) + "%"
                : "N/A"}
            </div>
          </div>
          <div className="text-[11px] text-slate-400">Interaction Ratio</div>
        </div>

        {/* Metric Card - Posts */}
        {user.posts_count !== undefined && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
              <Layers className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Posts</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1.5">
                {user.posts_count.toLocaleString()}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Total Publications</div>
          </div>
        )}

        {/* Metric Card - Avg Likes */}
        {user.avg_likes !== undefined && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
              <Heart className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span>Avg Likes</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1.5">
                {formatFollowers(user.avg_likes)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Average Likes/Post</div>
          </div>
        )}

        {/* Metric Card - Avg Comments */}
        {user.avg_comments !== undefined && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
              <MessageSquare className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Avg Comments</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1.5">
                {user.avg_comments.toLocaleString()}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Average Comments/Post</div>
          </div>
        )}

        {/* Metric Card - Avg Views */}
        {user.avg_views !== undefined && user.avg_views > 0 && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
              <Eye className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Avg Views</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1.5">
                {formatFollowers(user.avg_views)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Average Video Views</div>
          </div>
        )}

        {/* Metric Card - Avg Reels Plays */}
        {user.avg_reels_plays !== undefined && user.avg_reels_plays > 0 && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
              <CirclePlay className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <CirclePlay className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reels Plays</span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1.5">
                {formatFollowers(user.avg_reels_plays)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Average Reels Plays</div>
          </div>
        )}

        {/* Metric Card - Demographics */}
        {(user.gender || user.age_group) && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
              <Award className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Audience</span>
              </div>
              <div className="text-sm font-extrabold text-white mt-1.5 space-y-0.5">
                {user.gender && <div>Gender: <span className="text-violet-400 capitalize">{user.gender}</span></div>}
                {user.age_group && <div>Age: <span className="text-pink-400">{user.age_group}</span></div>}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Primary Demographics</div>
          </div>
        )}
      </div>
    </div>
  );
}
